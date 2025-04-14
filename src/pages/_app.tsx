import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ClerkProvider, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from '../store';
import { initializeCharacter } from '../store/slices/characterSlice';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Импорт MockClerkProvider и хука useMockUser для мок-режима
import { MockClerkProvider, useMockUser } from '../components/auth/MockProviders';

// Проверка, включен ли мок-режим
const isMockMode = process.env.NEXT_PUBLIC_CLERK_MOCK_MODE === 'true';
console.log('[_app.tsx] Clerk Mock Mode:', isMockMode ? 'Enabled' : 'Disabled');

// Компонент для инициализации с хуками Clerk
function ClerkAppInitializer({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        console.log('Инициализация персонажа на основе данных Clerk');
        store.dispatch(initializeCharacter(user));
      } else {
        console.log('Пользователь не авторизован, сбрасываем данные персонажа');
        store.dispatch(initializeCharacter(null));
      }
    }
  }, [isLoaded, isSignedIn, user]);

  return <>{children}</>;
}

// Компонент для инициализации с мок-хуками
function MockAppInitializer({ children }: { children: React.ReactNode }) {
  const mockUser = useMockUser();
  
  useEffect(() => {
    console.log('Мок-режим: Инициализация персонажа на основе мок-данных');
    if (mockUser) {
      store.dispatch(initializeCharacter(mockUser));
    } else {
      store.dispatch(initializeCharacter(null));
    }
  }, [mockUser]);

  return <>{children}</>;
}

// Общие мета-теги для всех версий приложения
function AppMetaTags() {
  return (
    <Head>
      <title>GOTOGROW | Обучение через игры</title>
      <meta name="description" content="Обучающий игровой портал для развития профессиональных навыков через увлекательные игры и симуляции" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <meta name="theme-color" content="#0f172a" />
      <link rel="icon" href="/favicon.ico" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://gameportal.example.com/" />
      <meta property="og:title" content="GOTOGROW | Обучение через игры" />
      <meta property="og:description" content="Обучающий игровой портал для развития профессиональных навыков через увлекательные игры и симуляции" />
      <meta property="og:image" content="https://gameportal.example.com/images/og-image.jpg" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://gameportal.example.com/" />
      <meta property="twitter:title" content="GOTOGROW | Обучение через игры" />
      <meta property="twitter:description" content="Обучающий игровой портал для развития профессиональных навыков через увлекательные игры и симуляции" />
      <meta property="twitter:image" content="https://gameportal.example.com/images/twitter-image.jpg" />
    </Head>
  );
}

// Общие настройки для Toast уведомлений
function AppToasts() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
}

// Версия приложения для мок-режима
function MockApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <MockClerkProvider>
      <Provider store={store}>
        <AppMetaTags />
        <AnimatePresence mode="wait" initial={false}>
          <MockAppInitializer>
            <Component {...pageProps} key={router.route} />
          </MockAppInitializer>
        </AnimatePresence>
        <AppToasts />
      </Provider>
    </MockClerkProvider>
  );
}

// Версия приложения для обычного режима с Clerk
function StandardApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <ClerkProvider {...pageProps}>
      <Provider store={store}>
        <AppMetaTags />
        <AnimatePresence mode="wait" initial={false}>
          <ClerkAppInitializer>
            <Component {...pageProps} key={router.route} />
          </ClerkAppInitializer>
        </AnimatePresence>
        <AppToasts />
      </Provider>
    </ClerkProvider>
  );
}

// Основной компонент приложения
function MyApp(props: AppProps) {
  // Выбираем нужную версию в зависимости от режима
  return isMockMode 
    ? <MockApp {...props} /> 
    : <StandardApp {...props} />;
}

export default MyApp; 