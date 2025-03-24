import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', error: false });

  // Обработчик изменения email
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setMessage({ text: '', error: false });
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ text: 'Пожалуйста, введите ваш email', error: true });
      return;
    }
    
    setLoading(true);
    setMessage({ text: '', error: false });
    
    try {
      // Отправляем запрос на восстановление пароля
      const response = await axios.post('/api/auth/forgot-password', { email });
      
      setMessage({ 
        text: 'Инструкции по восстановлению пароля отправлены на ваш email', 
        error: false 
      });
      
      // Можно добавить редирект через некоторое время
      setTimeout(() => {
        router.push('/auth/login');
      }, 5000);
    } catch (error: any) {
      setMessage({ 
        text: error.response?.data?.message || 'Произошла ошибка при обработке запроса', 
        error: true 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Восстановление пароля | GOTOGROW</title>
        <meta name="description" content="Восстановите доступ к вашему аккаунту" />
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
              Восстановление пароля
            </h1>
            <p className="text-gray-300">
              Введите ваш email для получения инструкций
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
                  value={email}
                  onChange={handleChange}
                  className="input-primary w-full"
                  placeholder="your@email.com"
                />
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
                      Отправка...
                    </span>
                  ) : (
                    'Восстановить пароль'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-400">Вспомнили пароль? </span>
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Войти
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