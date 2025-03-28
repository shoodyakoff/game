import { getSession, signIn } from 'next-auth/react';
import axios from 'axios';
import Router from 'next/router';

/**
 * Централизованная библиотека для управления сессией пользователя
 * Предоставляет методы для обновления сессии и синхронизации с бэкендом
 */

// Переменная для хранения времени последнего обновления сессии
let lastSessionRefresh = 0;
// Минимальный интервал между обновлениями сессии (5 секунд)
const MIN_REFRESH_INTERVAL = 5000;

export interface SessionUpdateOptions {
  forceRefresh?: boolean;
  maxRetries?: number;
  skipThrottling?: boolean; // Параметр для пропуска проверки времени
}

/**
 * Безопасное перенаправление на указанный URL
 * Предотвращает ошибки "Abort fetching component" при навигации
 * @param url URL для перенаправления
 */
export function safeRedirect(url: string) {
  if (typeof window === 'undefined') return;
  
  // Логирование для отладки
  console.log(`[safeRedirect] Перенаправление на: ${url}`);
  
  try {
    // Используем window.location.href вместо router.push для более надежной навигации
    // Это предотвращает ошибки "Abort fetching component for route"
    window.location.href = url;
  } catch (error) {
    console.error('Ошибка при перенаправлении:', error);
    // Резервный вариант в случае ошибки
    try {
      window.location.replace(url);
    } catch (e) {
      console.error('Ошибка даже при использовании location.replace:', e);
    }
  }
}

/**
 * Принудительно обновляет сессию пользователя
 * @returns Обновленную сессию или null в случае ошибки
 */
export async function refreshSession(options: SessionUpdateOptions = {}) {
  const { forceRefresh = true, maxRetries = 3, skipThrottling = false } = options;
  
  // Проверяем, не вызывалась ли функция недавно для предотвращения частых запросов
  const now = Date.now();
  if (!skipThrottling && now - lastSessionRefresh < MIN_REFRESH_INTERVAL) {
    console.log('Пропуск обновления сессии, слишком частые запросы');
    return null;
  }
  
  // Запрос актуальных данных пользователя с сервера
  try {
    // Обновляем время последнего запроса
    lastSessionRefresh = now;
    
    // Получаем актуальные данные пользователя с сервера
    const response = await axios.get('/api/auth/session-refresh');
    
    if (!response.data.success) {
      console.error('Ошибка при обновлении сессии:', response.data.message);
      return null;
    }
    
    if (forceRefresh) {
      // Вместо мгновенного перезагрузки страницы, планируем её через небольшой промежуток
      // и только если это первая перезагрузка (для предотвращения циклов)
      if (!window.sessionStorage.getItem('__session_refreshed')) {
        window.sessionStorage.setItem('__session_refreshed', 'true');
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
      return null;
    }
    
    return response.data.user;
  } catch (error) {
    console.error('Ошибка при обновлении сессии:', error);
    return null;
  }
}

/**
 * Обновляет данные пользователя и сессию после выбора персонажа
 * @param characterId - ID выбранного персонажа
 * @param characterType - Тип выбранного персонажа
 * @returns true если успешно, false в случае ошибки
 */
export async function updateCharacterSelection(characterId: string, characterType: string) {
  try {
    // Отправляем запрос на выбор персонажа
    const response = await axios.post('/api/character/select', {
      characterId,
      characterType
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Неизвестная ошибка при выборе персонажа');
    }

    // Создаем новую сессию через принудительное обновление страницы
    // Используем skipThrottling для гарантированного обновления после выбора персонажа
    await refreshSession({ forceRefresh: true, skipThrottling: true });
    
    return true;
  } catch (error) {
    console.error('Ошибка при обновлении выбора персонажа:', error);
    return false;
  }
}

/**
 * Перенаправляет пользователя с учетом его состояния сессии
 * @param targetPath - Путь для перенаправления
 * @param fallbackPath - Резервный путь, если не удается перенаправить
 */
export async function redirectWithSessionCheck(targetPath: string, fallbackPath?: string) {
  // Проверяем сессию перед перенаправлением
  const session = await getSession();
  
  // Если нет сессии или нет выбранного персонажа, и мы пытаемся перейти на защищенный маршрут
  if (!session?.user?.hasCharacter && targetPath.startsWith('/dashboard')) {
    safeRedirect(fallbackPath || '/character/select');
    return;
  }
  
  // Если есть персонаж и пытаемся перейти на страницу выбора персонажа
  if (session?.user?.hasCharacter && targetPath === '/character/select') {
    safeRedirect(fallbackPath || '/dashboard');
    return;
  }
  
  // В остальных случаях перенаправляем по запрошенному пути
  safeRedirect(targetPath);
} 