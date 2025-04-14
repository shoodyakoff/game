import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import type { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import withMockMode, { WithAuthProps } from '../components/auth/withMockMode';

// Страница с пропсами аутентификации от HOC
const Home: NextPage<WithAuthProps> = ({ isLoaded, isSignedIn, user }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900">
      <Head>
        <title>GOTOGROW | Обучение через игры</title>
        <meta name="description" content="Обучающий игровой портал для развития профессиональных навыков через увлекательные игры и симуляции" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Навигация */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="bg-indigo-600 rounded-full h-8 w-8 flex items-center justify-center text-white mr-2">
                G
              </div>
              <span className="text-indigo-400 font-bold text-xl">GO<span className="text-indigo-300">TO</span><span className="text-indigo-200">GROW</span></span>
            </div>
            
            <div>
              {isLoaded && (
                isSignedIn ? (
                  <div className="flex items-center space-x-4">
                    <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Личный кабинет
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link href="/sign-in" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                      Вход
                    </Link>
                    <Link href="/sign-up" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Регистрация
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Герой-секция */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Учитесь <span className="text-indigo-400">играя</span>
            </h1>
            <p className="mt-6 max-w-xl mx-auto text-xl text-slate-300">
              Развивайте профессиональные навыки через увлекательные игровые симуляции
            </p>
            <div className="mt-10 space-x-4">
              {isLoaded && !isSignedIn && (
                <>
                  <Link href="/sign-up" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-base font-medium transition-colors">
                    Начать бесплатно
                  </Link>
                  <Link href="#how-it-works" className="inline-block bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-md text-base font-medium transition-colors">
                    Узнать больше
                  </Link>
                </>
              )}
              {isLoaded && isSignedIn && (
                <Link href="/dashboard" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-base font-medium transition-colors">
                  Перейти в кабинет
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Как это работает */}
      <section id="how-it-works" className="py-16 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Как это работает</h2>
            <p className="mt-4 text-xl text-slate-300">Наш подход к обучению через игровые механики</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-700 p-6 rounded-xl shadow-lg"
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Выберите персонажа</h3>
              <p className="text-slate-300">Начните свой путь с выбора персонажа, соответствующего вашим целям и стилю обучения</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-700 p-6 rounded-xl shadow-lg"
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Проходите уровни</h3>
              <p className="text-slate-300">Решайте интересные задачи, принимайте решения и наблюдайте их последствия в безопасной среде</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-700 p-6 rounded-xl shadow-lg"
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Развивайте навыки</h3>
              <p className="text-slate-300">Получайте опыт, новые знания и развивайте свои профессиональные навыки с каждым пройденным уровнем</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Преимущества обучения через игры</h2>
            <p className="mt-4 text-xl text-slate-300">Почему игровой формат эффективнее традиционного образования</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <img
              src="/images/games/hero-image.jpg"
              alt="Обучение через игры"
              className="rounded-xl shadow-2xl w-full h-auto lg:h-full lg:w-auto object-cover"
            />
            
            <div className="space-y-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">Увлекательное погружение</h3>
                  <p className="mt-2 text-slate-300">Игровой процесс помогает не просто запоминать информацию, а по-настоящему погружаться в сценарии, которые могут возникнуть в реальной работе</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">Практика без риска</h3>
                  <p className="mt-2 text-slate-300">Вы можете пробовать разные решения и видеть их последствия, не рискуя реальными проектами или карьерой</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">Мгновенная обратная связь</h3>
                  <p className="mt-2 text-slate-300">Получайте отзывы о своих действиях непосредственно в процессе обучения, что ускоряет приобретение новых навыков</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">Социальное взаимодействие</h3>
                  <p className="mt-2 text-slate-300">Сравнивайте свои результаты с другими пользователями и делитесь своими достижениями</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-16 bg-gradient-to-r from-indigo-800 to-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Начните свое игровое обучение сегодня</h2>
            <p className="text-xl text-indigo-200 mb-10 max-w-3xl mx-auto">
              Присоединяйтесь к тысячам профессионалов, которые улучшают свои навыки через интерактивное обучение
            </p>
            {isLoaded && !isSignedIn && (
              <Link href="/sign-up" className="inline-block bg-white text-indigo-800 hover:bg-indigo-100 px-8 py-4 rounded-lg text-xl font-bold transition-colors">
                Регистрация бесплатна
              </Link>
            )}
            {isLoaded && isSignedIn && (
              <Link href="/dashboard" className="inline-block bg-white text-indigo-800 hover:bg-indigo-100 px-8 py-4 rounded-lg text-xl font-bold transition-colors">
                Перейти в кабинет
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="bg-slate-800 border-t border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">О проекте</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-white transition-colors text-sm">
                    О нас
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="text-slate-400 hover:text-white transition-colors text-sm">
                    Команда
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-slate-400 hover:text-white transition-colors text-sm">
                    Вакансии
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Ресурсы</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-slate-400 hover:text-white transition-colors text-sm">
                    Блог
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-slate-400 hover:text-white transition-colors text-sm">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-slate-400 hover:text-white transition-colors text-sm">
                    Поддержка
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Правовая информация</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">
                    Условия использования
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">
                    Политика конфиденциальности
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-slate-400 hover:text-white transition-colors text-sm">
                    Политика cookie
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Контакты</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:info@gotogrow.com" className="text-slate-400 hover:text-white transition-colors text-sm">
                    info@gotogrow.com
                  </a>
                </li>
                <li>
                  <a href="tel:+78001234567" className="text-slate-400 hover:text-white transition-colors text-sm">
                    +7 800 123-45-67
                  </a>
                </li>
                <li className="flex space-x-4 mt-4">
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 text-center">
            <p className="text-sm text-slate-500">© 2023 GOTOGROW. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Оборачиваем компонент в HOC для поддержки мок-режима
export default withMockMode(Home); 