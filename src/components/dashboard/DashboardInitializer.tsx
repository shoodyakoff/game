import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

// Создаем переменную вне компонента, которая будет глобальной для всего приложения
// Это позволит нам отслеживать проверенные сессии между рендерами и компонентами
const CHECKED_SESSIONS = new Set<string>();

/**
 * Компонент для проверки актуальности сессии при входе на дашборд
 * Выполняет только одну проверку при первой загрузке страницы
 */
const DashboardInitializer: React.FC = () => {
  const { data: session, status, update } = useSession();
  const [isChecking, setIsChecking] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const didInitRef = useRef(false);
  
  useEffect(() => {
    // Создаем AbortController для отмены запросов при размонтировании
    abortControllerRef.current = new AbortController();
    
    const checkSessionOnce = async () => {
      // Выходим, если сессия еще не загружена или компонент уже выполнил проверку
      if (status !== 'authenticated' || !session?.user?.id || didInitRef.current) {
        return;
      }
      
      // Отмечаем, что инициализация началась
      didInitRef.current = true;
      
      // Получаем ID пользователя
      const userId = session.user.id;
      
      // Если сессия для этого пользователя уже была проверена, пропускаем проверку
      if (CHECKED_SESSIONS.has(userId)) {
        console.log(`Сессия для пользователя ${userId} уже проверена ранее`);
        return;
      }
      
      // Устанавливаем флаг загрузки
      setIsChecking(true);
      
      try {
        console.log('Проверка актуальности сессии...');
        
        // Делаем только один запрос для проверки сессии
        const response = await axios.get('/api/auth/update-session', {
          timeout: 3000,
          signal: abortControllerRef.current?.signal
        });
        
        // Добавляем ID пользователя в Set проверенных сессий
        CHECKED_SESSIONS.add(userId);
        
        if (response.data.success) {
          if (response.data.needsUpdate) {
            console.log('Обнаружено расхождение сессии с БД, обновляем...');
            
            // Обновляем сессию только если нужно
            await update({
              ...session,
              user: {
                ...session.user,
                hasCharacter: response.data.dbUser.hasCharacter,
                characterType: response.data.dbUser.characterType,
                role: response.data.dbUser.role
              }
            });
            
            console.log('Сессия успешно обновлена');
          } else {
            console.log('Сессия актуальна, проверка завершена');
          }
        }
      } catch (error: any) {
        // Игнорируем ошибки отмены запроса
        if (error.name === 'CanceledError' || error.name === 'AbortError') {
          console.log('Запрос на проверку сессии был отменен');
        } else {
          console.error('Ошибка при проверке сессии:', error);
          
          // Даже при ошибке помечаем сессию как проверенную, чтобы избежать повторных запросов
          CHECKED_SESSIONS.add(userId);
        }
      } finally {
        // Завершаем процесс проверки
        setIsChecking(false);
      }
    };
    
    // Запускаем проверку один раз при монтировании
    checkSessionOnce();
    
    return () => {
      // Отменяем все активные запросы при размонтировании
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [session, status, update]);
  
  // Компонент не рендерит никакого UI
  return null;
};

export default DashboardInitializer; 