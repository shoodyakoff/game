import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Register() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  // Состояние формы
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Состояние для валидации
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // Состояние для ошибок API
  const [error, setError] = useState('');
  
  // Объединенное состояние загрузки
  const [loading, setLoading] = useState(false);
  const isSubmitting = loading || isLoading;
  
  // Состояние для отслеживания попытки регистрации
  const [isRegistering, setIsRegistering] = useState(false);

  // Получаем URL для перенаправления после регистрации
  const { returnUrl, callbackUrl } = router.query;
  
  // Если пользователь уже авторизован, перенаправляем его
  useEffect(() => {
    if (isAuthenticated && !isRegistering) {
      const redirectUrl = returnUrl || callbackUrl || '/dashboard';
      let url = typeof redirectUrl === 'string' ? redirectUrl : '/dashboard';
      
      // Защита от циклических редиректов
      if (url.includes('/auth/')) {
        url = '/dashboard';
      }
      
      router.replace(url, undefined, { shallow: true });
    }
  }, [isAuthenticated, returnUrl, callbackUrl, router, isRegistering]);

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Сбрасываем ошибки
    setValidationErrors(prev => ({
      ...prev,
      [name]: '',
    }));
    setError('');
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    setIsRegistering(true);
    
    try {
      // Проверка соединения
      if (!navigator.onLine) {
        throw new Error('Отсутствует подключение к интернету');
      }

      // Регистрация пользователя через API
      const response = await axios.post('/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      }, {
        timeout: 10000, // 10 секунд таймаут
      });
      
      if (response.data.success) {
        // После успешной регистрации выполняем вход
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password
        });
        
        if (result?.error) {
          setError(result.error);
        } else if (result?.ok) {
          // Успешный вход - выполняем перенаправление клиентским путем
          console.log('Регистрация и вход успешны, перенаправление на /dashboard');
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      console.error('Ошибка регистрации:', err);
      
      // Специфическая обработка ошибок
      if (err.code === 'ECONNABORTED') {
        setError('Превышено время ожидания ответа от сервера');
      } else if (!navigator.onLine) {
        setError('Отсутствует подключение к интернету');
      } else if (axios.isAxiosError(err) && !err.response) {
        setError('Не удалось подключиться к серверу');
      } else {
        setError(err.response?.data?.message || 'Произошла ошибка при регистрации. Попробуйте позже.');
      }
    } finally {
      setLoading(false);
      setIsRegistering(false);
    }
  };

  // Валидация формы перед отправкой
  const validateForm = () => {
    const errors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    // Проверка имени пользователя
    if (formData.username.length < 3) {
      errors.username = 'Имя пользователя должно содержать не менее 3 символов';
      isValid = false;
    }

    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Введите корректный email адрес';
      isValid = false;
    }

    // Проверка пароля
    if (formData.password.length < 6) {
      errors.password = 'Пароль должен содержать не менее 6 символов';
      isValid = false;
    }
    
    // Проверка наличия цифр и специальных символов
    const hasNumber = /\d/.test(formData.password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
    
    if (!hasNumber || !hasSpecial) {
      errors.password = 'Пароль должен содержать хотя бы одну цифру и один специальный символ';
      isValid = false;
    }

    // Проверка совпадения паролей
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  return (
    <>
      <Head>
        <title>Регистрация | GAMEPORTAL</title>
        <meta name="description" content="Зарегистрируйтесь, чтобы начать играть" />
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
              Создайте аккаунт
            </h1>
            <p className="text-gray-300">
              Присоединяйтесь к нашему игровому сообществу
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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                  Имя пользователя
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="input-primary w-full"
                  placeholder="username"
                />
                {validationErrors.username && (
                  <p className="form-error">{validationErrors.username}</p>
                )}
              </div>

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
                {validationErrors.email && (
                  <p className="form-error">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Пароль
                </label>
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
                <p className="text-xs text-gray-400 mt-1">
                  Минимум 6 символов, включая цифры и спецсимволы
                </p>
                {validationErrors.password && (
                  <p className="form-error">{validationErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Подтвердите пароль
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-primary w-full"
                  placeholder="••••••••"
                />
                {validationErrors.confirmPassword && (
                  <p className="form-error">{validationErrors.confirmPassword}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex justify-center items-center"
                >
                  {isSubmitting && (
                    <span className="spinner mr-2"></span>
                  )}
                  {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Уже есть аккаунт?{' '}
                <Link 
                  href="/auth/login" 
                  className="text-indigo-400 hover:text-indigo-300 transition"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsRegistering(false); // Сбрасываем состояние регистрации
                    router.push('/auth/login', undefined, { shallow: true });
                  }}
                >
                  Войти
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
} 