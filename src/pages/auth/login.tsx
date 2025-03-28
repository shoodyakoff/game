import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signIn, useSession } from 'next-auth/react';

// Интерфейс для статусного сообщения
interface StatusMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const isMounted = useRef(true);
  
  // Объединенное состояние загрузки
  const [formLoading, setFormLoading] = useState(false);
  const isSubmitting = formLoading || isLoading;

  // Состояние для ошибок аутентификации
  const [error, setError] = useState<string | null>(null);
  
  // Состояние для отслеживания попытки входа
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Статусное сообщение
  const [statusMsg, setStatus] = useState<StatusMessage | null>(null);

  // Состояние формы
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  
  // Состояние для отслеживания клиентского рендеринга
  const [isClient, setIsClient] = useState(false);

  // Получаем URL для перенаправления после авторизации
  const { callbackUrl, error: routerError, character } = router.query;

  // Устанавливаем флаг монтирования
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Проверяем, авторизован ли пользователь
  useEffect(() => {
    if (isAuthenticated && isMounted.current) {
      // Если у пользователя есть выбранный персонаж, перенаправляем на дашборд
      // В противном случае - на выбор персонажа
      if (session?.user?.hasCharacter) {
        const redirectPath = callbackUrl?.toString() || '/dashboard';
        router.push(redirectPath)
          .catch(err => {
            console.error('Ошибка при перенаправлении после аутентификации:', err);
          });
      } else {
        router.push('/character/select')
          .catch(err => {
            console.error('Ошибка при перенаправлении на выбор персонажа:', err);
          });
      }
    }
  }, [isAuthenticated, session, router, callbackUrl]);

  // При входе через внешний провайдер (NextAuth)
  useEffect(() => {
    // Мониторим изменения статуса сессии NextAuth
    if (status === 'authenticated' && session?.user && isMounted.current) {
      // Если у пользователя есть выбранный персонаж, перенаправляем на дашборд
      // В противном случае - на выбор персонажа
      const redirectPath = session.user.hasCharacter 
        ? (callbackUrl?.toString() || '/dashboard')
        : '/character/select';
      
      router.push(redirectPath)
        .catch(err => {
          console.error('Ошибка при перенаправлении после проверки сессии:', err);
          if (isMounted.current) {
            window.location.href = redirectPath;
          }
        });
    }
  }, [status, session, router, callbackUrl]);

  // Устанавливаем флаг клиентского рендеринга
  useEffect(() => {
    if (isMounted.current) {
      setIsClient(true);
      
      // Обрабатываем ошибки из URL
      if (routerError) {
        switch (routerError) {
          case 'CredentialsSignin':
            setError('Неверный email или пароль');
            break;
          case 'SessionRequired':
            setError('Необходима авторизация');
            break;
          default:
            setError('Произошла ошибка при входе');
            break;
        }
      }
    }
  }, [routerError]);

  // Если пользователь уже авторизован, перенаправляем его
  useEffect(() => {
    if (isAuthenticated && !isLoggingIn && isMounted.current) {
      const redirectUrl = callbackUrl 
        ? decodeURIComponent(callbackUrl as string) 
        : '/dashboard';
      
      // Защита от циклических редиректов
      if (redirectUrl.includes('/auth/')) {
        router.replace('/dashboard', undefined, { shallow: true })
          .catch(err => {
            console.error('Ошибка при замене URL (циклический редирект):', err);
          });
      } else {
        router.replace(redirectUrl, undefined, { shallow: true })
          .catch(err => {
            console.error('Ошибка при замене URL:', err);
            if (isMounted.current) {
              window.location.href = redirectUrl;
            }
          });
      }
    }
  }, [isAuthenticated, callbackUrl, router, isLoggingIn]);

  // Показываем сообщение о успешном выборе персонажа
  useEffect(() => {
    if (character === 'selected' && isMounted.current) {
      setStatus({
        type: 'success',
        message: 'Персонаж успешно выбран! Пожалуйста, войдите снова для применения изменений.'
      });
    }
  }, [character]);

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Сбрасываем ошибку при изменении полей
    setError(null);
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    setIsLoggingIn(true);
    
    try {
      // Проверка соединения
      if (!navigator.onLine) {
        throw new Error('Отсутствует подключение к интернету');
      }

      // Используем NextAuth для входа без автоматического редиректа
      const result = await signIn('credentials', {
        redirect: false, // Важно! Меняем на false чтобы предотвратить ошибку с Location
        email: formData.email,
        password: formData.password,
        remember: formData.remember
      });
      
      // Проверяем, что компонент всё ещё смонтирован
      if (!isMounted.current) return;
      
      if (result?.error) {
        switch (result.error) {
          case 'CredentialsSignin':
            setError('Неверный email или пароль');
            break;
          default:
            setError(result.error);
        }
      } else if (result?.ok) {
        // Успешный вход - делаем перенаправление через router
        // Определяем, куда перенаправить пользователя
        let redirectTo = '/dashboard';
        if (callbackUrl && typeof callbackUrl === 'string') {
          // Обезопасим URL
          redirectTo = callbackUrl.replace(/[^\w\s\/\-?=&.]/g, '');
        }
        
        console.log('Логин успешен, перенаправление на:', redirectTo);
        
        // Добавляем задержку для завершения процессов NextAuth
        setTimeout(() => {
          // Перед перенаправлением проверяем, что компонент всё ещё смонтирован
          if (!isMounted.current) return;
          
          try {
            router.push(redirectTo)
              .catch(routerErr => {
                console.error('Ошибка при перенаправлении через router:', routerErr);
                // Запасной вариант - используем window.location
                if (isMounted.current) {
                  window.location.href = redirectTo;
                }
              });
          } catch (routingError) {
            console.error('Критическая ошибка при перенаправлении:', routingError);
            // Запасной вариант
            if (isMounted.current) {
              window.location.href = redirectTo;
            }
          }
        }, 300); // Задержка 300 мс для завершения процессов NextAuth
      }
    } catch (err: any) {
      if (!isMounted.current) return;
      
      console.error('Критическая ошибка входа:', err);
      
      if (!navigator.onLine) {
        setError('Отсутствует подключение к интернету');
      } else {
        setError('Произошла ошибка при подключении к серверу');
      }
    } finally {
      if (isMounted.current) {
        setFormLoading(false);
        // Не сбрасываем флаг isLoggingIn здесь, чтобы перенаправление успело произойти
        // isLoggingIn будет сброшен при успешном перенаправлении
      }
    }
  };

  return (
    <>
      <Head>
        <title>Вход | GAMEPORTAL</title>
        <meta name="description" content="Войдите в свой аккаунт" />
      </Head>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <div className="h-20 mx-auto flex items-center justify-center">
                <h1 className="text-3xl font-bold text-indigo-400">
                  GAME<span className="text-white">PORTAL</span>
                </h1>
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-white mb-2">
              Добро пожаловать
            </h1>
            <p className="text-gray-300">
              Войдите в свой аккаунт, чтобы продолжить
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8">
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded mb-6"
              >
                <p>{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-primary w-full"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Пароль
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                    Забыли пароль?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-primary w-full"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                  Запомнить меня
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex justify-center items-center"
                >
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isSubmitting ? 'Вход...' : 'Войти'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-400">Ещё нет аккаунта? </span>
              <Link 
                href="/auth/register" 
                className="text-blue-400 hover:text-blue-300 font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLoggingIn(false); // Сбрасываем состояние входа
                  router.push('/auth/register', undefined, { shallow: true });
                }}
              >
                Зарегистрироваться
              </Link>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-400">
            <Link href="/" className="hover:text-white">
              ← Вернуться на главную
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}