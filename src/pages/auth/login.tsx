import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import { login, clearError } from '../../store/slices/authSlice';
import type { RootState } from '../../store';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Состояние формы
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  
  // Состояние для отслеживания попытки отправки формы
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Состояние для отслеживания клиентского рендеринга
  const [isClient, setIsClient] = useState(false);

  // Получаем URL для перенаправления после авторизации
  const { returnUrl } = router.query;

  // Устанавливаем флаг клиентского рендеринга
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Если пользователь уже авторизован, перенаправляем его
  useEffect(() => {
    if (isAuthenticated) {
      const redirectUrl = returnUrl 
        ? decodeURIComponent(returnUrl as string) 
        : '/dashboard';
      
      // Проверяем, не содержит ли returnUrl путь аутентификации
      // и не является ли он цепочкой с returnUrl=
      const isValidRedirect = typeof redirectUrl === 'string' && 
                              !redirectUrl.includes('/auth/') && 
                              !redirectUrl.includes('returnUrl=');
      
      router.push(isValidRedirect ? redirectUrl : '/dashboard');
    }
  }, [isAuthenticated, returnUrl, router]);

  // Очищаем ошибки при изменении email или пароля
  useEffect(() => {
    if (error && formSubmitted) {
      dispatch(clearError());
      setFormSubmitted(false);
    }
  }, [formData.email, formData.password, error, dispatch, formSubmitted]);

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    dispatch(login({ 
      email: formData.email, 
      password: formData.password,
      remember: true // Всегда сохраняем токен для предотвращения проблем с обновлением страницы
    }));
  };

  return (
    <>
      <Head>
        <title>Вход | GOTOGROW</title>
        <meta name="description" content="Войдите в свой аккаунт" />
      </Head>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8"
        style={{ pointerEvents: 'auto' }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
          style={{ pointerEvents: 'auto' }}
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

            <form onSubmit={handleSubmit} className="space-y-6" style={{ pointerEvents: 'auto' }}>
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
                  style={{ pointerEvents: 'auto' }}
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
                  style={{ pointerEvents: 'auto' }}
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
                  style={{ pointerEvents: 'auto' }}
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                  Запомнить меня
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                  style={{ pointerEvents: 'auto' }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Вход...
                    </span>
                  ) : (
                    'Войти'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-400">Ещё нет аккаунта? </span>
              <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 font-medium">
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