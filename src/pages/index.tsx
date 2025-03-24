import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useState, useEffect } from 'react';

const Home: NextPage = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Указываем, что мы находимся на клиенте
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Head>
        <title>GOTOGROW | Обучение через игры</title>
        <meta name="description" content="Обучающий игровой портал для развития профессиональных навыков через увлекательные игры и симуляции" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Навигация */}
      <header className="bg-slate-800 shadow-lg">
        <div className="container-wide py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">
              <span className="text-indigo-600">GO</span>
              <span className="text-white">TO</span>
              <span className="text-indigo-600">GROW</span>
            </h1>
          </div>
          
          <div className="flex space-x-4">
            {isClient && isAuthenticated ? (
              <>
                <Link href="/dashboard" legacyBehavior>
                  <a className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors">
                    Мой кабинет
                  </a>
                </Link>
                <Link href="/profile" legacyBehavior>
                  <a className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center">
                    <span className="mr-2">{user?.username || 'Профиль'}</span>
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                  </a>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" legacyBehavior>
                  <a className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors">Войти</a>
                </Link>
                <Link href="/auth/register" legacyBehavior>
                  <a className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors">Регистрация</a>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Главный контент */}
      <main className="flex-grow flex flex-col">
        {/* Герой-секция */}
        <section className="py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900/30 to-slate-900/80" />
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] bg-repeat opacity-10" />
          </div>
          
          <div className="container-wide relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                  Обучение через <span className="text-indigo-400">игры</span>
                </h2>
                <p className="text-slate-300 text-lg mb-8 max-w-lg">
                  Наш игровой портал помогает развивать профессиональные навыки 
                  через увлекательные и интерактивные игровые симуляции.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/auth/register" legacyBehavior>
                    <a className="btn-primary">Начать бесплатно</a>
                  </Link>
                  <Link href="/games-info" legacyBehavior>
                    <a className="btn-outline">Узнать больше</a>
                  </Link>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative hidden md:block"
              >
                <div className="relative z-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-2xl overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9 relative">
                    <img 
                      src="/images/games/hero-image.jpg" 
                      alt="Игровой процесс"
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center mb-0">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-2">
                          <span className="text-sm font-bold">PM</span>
                        </div>
                        <h3 className="font-bold">Product management</h3>
                      </div>
                      <p className="text-sm text-slate-200">Управляйте продуктам и командой, достигайте целей в срок</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg rotate-6 z-0 shadow-lg" />
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Секция с особенностями */}
        <section className="py-16 bg-slate-800/50">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Почему наш игровой портал?</h2>
              <p className="text-slate-300 max-w-2xl mx-auto">Мы предлагаем уникальный подход к обучению, основанный на игровых механиках и реальных сценариях</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="card bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Учись играя</h3>
                <p className="text-slate-400">Приобретайте новые навыки в увлекательной игровой форме, решая реальные задачи и сценарии.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="card bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <div className="w-12 h-12 bg-purple-600/20 text-purple-400 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Индивидуальный прогресс</h3>
                <p className="text-slate-400">Отслеживайте свой прогресс и развивайтесь в собственном темпе, получая награды за достижения.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="card bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <div className="w-12 h-12 bg-emerald-600/20 text-emerald-400 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Сообщество</h3>
                <p className="text-slate-400">Присоединяйтесь к сообществу профессионалов, общайтесь и соревнуйтесь с другими игроками.</p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Секция с призывом к действию */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="container-wide text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Готовы начать свой путь?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Зарегистрируйтесь сейчас и получите доступ к нашим играм. Первые 3 игры доступны совершенно бесплатно!
            </p>
            <Link href="/auth/register" legacyBehavior>
              <a className="inline-block bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-slate-100 transition-colors">
                Начать бесплатно
              </a>
            </Link>
          </div>
        </section>
      </main>

      {/* Футер */}
      <footer className="bg-slate-800/50 border-t border-slate-700 py-6">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-slate-400">© 2023 GOTOGROW. Все права защищены.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/privacy" legacyBehavior>
                <a className="text-sm text-slate-400 hover:text-white">Политика конфиденциальности</a>
              </Link>
              <Link href="/terms" legacyBehavior>
                <a className="text-sm text-slate-400 hover:text-white">Условия использования</a>
              </Link>
              <Link href="/help" legacyBehavior>
                <a className="text-sm text-slate-400 hover:text-white">Помощь</a>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 