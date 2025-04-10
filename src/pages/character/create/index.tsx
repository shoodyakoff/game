import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import axios from 'axios';
import type { RootState } from '../../../store';
import { useAppDispatch } from '../../../store/hooks';
import { useUser } from '@clerk/nextjs';

// Заглушка для страницы создания персонажа
export default function CreateCharacter() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isSignedIn, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Обработчик для создания персонажа (заглушка)
  const handleCreateCharacter = async () => {
    setLoading(true);
    setError('');

    try {
      // В будущем здесь будет реальный API-запрос для создания персонажа
      // Сейчас просто обновляем флаг hasCharacter у пользователя
      await axios.post(
        '/api/character/create',
        { /* здесь будут данные персонажа */ }
      );

      // Перенаправляем на dashboard после создания персонажа
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Ошибка создания персонажа:', error);
      setError(
        error.response?.data?.message || 
        'Произошла ошибка при создании персонажа'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Создание персонажа | GOTOGROW</title>
        <meta name="description" content="Создайте своего персонажа для игрового мира" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 flex flex-col justify-center items-center px-4 py-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Создание персонажа
            </h1>
            <p className="text-gray-300">
              Это заглушка для страницы создания персонажа. 
              В будущем здесь будет полноценный интерфейс для настройки вашего игрового персонажа.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded mb-6">
                <p>{error}</p>
              </div>
            )}

            <div className="mb-8 text-center">
              <p className="text-gray-300 mb-6">
                Здесь будет форма для создания персонажа с выбором класса, внешности, 
                характеристик и других параметров.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {['Воин', 'Маг', 'Лучник'].map((className) => (
                  <div
                    key={className}
                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 cursor-pointer transition"
                  >
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-600 rounded-full"></div>
                    <h3 className="text-white font-medium">{className}</h3>
                    <p className="text-gray-400 text-sm">Описание класса</p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCreateCharacter}
                disabled={loading}
                className="btn-primary w-full max-w-md mx-auto"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Создание персонажа...
                  </span>
                ) : (
                  'Создать персонажа (тестовая кнопка)'
                )}
              </button>
            </div>

            <div className="text-center text-sm text-gray-400">
              <p>Примечание: Это временная заглушка для демонстрации потока пользователя.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
} 