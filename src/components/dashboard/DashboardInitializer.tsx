import { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

// Создаем переменную вне компонента, которая будет глобальной для всего приложения
// Это позволит нам отслеживать проверенные сессии между рендерами и компонентами
const CHECKED_USERS = new Set<string>();

/**
 * Компонент для инициализации данных при входе на дашборд
 * Выполняет только одну проверку при первой загрузке страницы
 */
const DashboardInitializer: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isChecking, setIsChecking] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const didInitRef = useRef(false);
  
  useEffect(() => {
    // Создаем AbortController для отмены запросов при размонтировании
    abortControllerRef.current = new AbortController();
    
    const initializeData = async () => {
      // Выходим, если пользователь еще не загружен, не вошел в систему, или компонент уже выполнил проверку
      if (!isLoaded || !isSignedIn || !user?.id || didInitRef.current) {
        return;
      }
      
      // Отмечаем, что инициализация началась
      didInitRef.current = true;
      
      // Получаем ID пользователя
      const userId = user.id;
      
      // Если пользователь уже был проверен, пропускаем проверку
      if (CHECKED_USERS.has(userId)) {
        console.log(`Пользователь ${userId} уже проверен ранее`);
        return;
      }
      
      // Устанавливаем флаг загрузки
      setIsChecking(true);
      
      try {
        console.log('Инициализация данных пользователя...');
        
        // Делаем запрос для получения актуальных данных персонажа
        await axios.get('/api/character/current', {
          timeout: 3000,
          signal: abortControllerRef.current?.signal
        });
        
        // Добавляем ID пользователя в Set проверенных пользователей
        CHECKED_USERS.add(userId);
        
        console.log('Инициализация данных успешно завершена');
      } catch (error: any) {
        // Игнорируем ошибки отмены запроса
        if (error.name === 'CanceledError' || error.name === 'AbortError') {
          console.log('Запрос на инициализацию был отменен');
        } else {
          console.error('Ошибка при инициализации данных:', error);
          
          // Даже при ошибке помечаем пользователя как проверенного, чтобы избежать повторных запросов
          CHECKED_USERS.add(userId);
        }
      } finally {
        // Завершаем процесс проверки
        setIsChecking(false);
      }
    };
    
    // Запускаем инициализацию один раз при монтировании
    initializeData();
    
    return () => {
      // Отменяем все активные запросы при размонтировании
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [user, isLoaded, isSignedIn]);
  
  // Компонент не рендерит никакого UI
  return null;
};

export default DashboardInitializer; 