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
 * Безопасное перенаправление с использованием Next.js Router
 * @param url URL для перенаправления
 */
export function safeRedirect(url: string) {
  // Проверяем, что URL допустимый
  try {
    // Проверяем наличие Router для SSR-совместимости
    if (typeof window !== 'undefined') {
      console.log(`[safeRedirect] Перенаправление на ${url} используя Next.js Router`);
      
      // Очищаем URL от недопустимых символов
      const safeUrl = url.replace(/[^\w\s\/\-?=&.]/g, '');
      
      // Используем Next.js Router вместо window.location для клиентской навигации
      Router.push(safeUrl)
        .catch((err) => {
          console.error('[safeRedirect] Ошибка при перенаправлении через Router:', err);
          // Запасной вариант - используем window.location
          console.log('[safeRedirect] Использую запасной вариант: window.location');
          window.location.href = safeUrl;
        });
    } else {
      // Для SSR случаев (хотя это маловероятно)
      console.log('[safeRedirect] SSR-режим, перенаправление будет обработано сервером');
    }
  } catch (error) {
    console.error('[safeRedirect] Ошибка при перенаправлении:', error);
    // Запасной вариант - просто перенаправляем на дашборд
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
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