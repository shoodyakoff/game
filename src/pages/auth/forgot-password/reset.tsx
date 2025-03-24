import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', error: false });
  const [tokenValid, setTokenValid] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    password: '',
    confirmPassword: ''
  });

  // Проверяем валидность токена при загрузке страницы
  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  // Проверка токена
  const verifyToken = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/auth/forgot-password/verify?token=${token}`);
      setTokenValid(true);
    } catch (error: any) {
      setTokenValid(false);
      setMessage({
        text: 'Ссылка для сброса пароля недействительна или просрочена',
        error: true
      });
    } finally {
      setLoading(false);
    }
  };

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Сбрасываем ошибки валидации при вводе
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
    
    // Проверяем совпадение паролей при вводе
    if (name === 'confirmPassword' && value !== formData.password) {
      setValidationErrors({
        ...validationErrors,
        confirmPassword: 'Пароли не совпадают'
      });
    } else if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
      setValidationErrors({
        ...validationErrors,
        confirmPassword: 'Пароли не совпадают'
      });
    } else if (name === 'confirmPassword' && value === formData.password) {
      setValidationErrors({
        ...validationErrors,
        confirmPassword: ''
      });
    }
  };

  // Валидация формы
  const validateForm = () => {
    const errors = {
      password: '',
      confirmPassword: ''
    };
    let isValid = true;

    if (formData.password.length < 6) {
      errors.password = 'Пароль должен содержать не менее 6 символов';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage({ text: '', error: false });
    
    try {
      const response = await axios.post('/api/auth/forgot-password/reset', {
        token,
        password: formData.password
      });
      
      setMessage({
        text: 'Пароль успешно изменен!',
        error: false
      });
      
      // Редирект на страницу входа через несколько секунд
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
      
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.message || 'Произошла ошибка при сбросе пароля',
        error: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Сброс пароля | GOTOGROW</title>
        <meta name="description" content="Введите новый пароль для вашего аккаунта" />
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
              Создание нового пароля
            </h1>
            <p className="text-gray-300">
              Введите новый пароль для вашего аккаунта
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8">
            {message.text && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className={`${
                  message.error ? 'bg-red-500/10 border-red-500/50 text-red-300' : 'bg-green-500/10 border-green-500/50 text-green-300'
                } border px-4 py-3 rounded mb-6`}
              >
                <p>{message.text}</p>
              </motion.div>
            )}

            {loading && !message.text ? (
              <div className="py-8 flex justify-center">
                <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : tokenValid && !message.error ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Новый пароль
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-primary w-full ${validationErrors.password ? 'border-red-500' : ''}`}
                    placeholder="••••••••"
                  />
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-400">{validationErrors.password}</p>
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
                    className={`input-primary w-full ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="••••••••"
                  />
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400">{validationErrors.confirmPassword}</p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Сохранение...
                      </span>
                    ) : (
                      'Сохранить новый пароль'
                    )}
                  </button>
                </div>
              </form>
            ) : null}

            {!loading && (!token || message.error) && (
              <div className="text-center py-4">
                <Link href="/auth/forgot-password" className="text-blue-400 hover:text-blue-300">
                  Запросить новую ссылку для сброса пароля
                </Link>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-400">
            <Link href="/auth/login" className="hover:text-white">
              ← Вернуться на страницу входа
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
} 