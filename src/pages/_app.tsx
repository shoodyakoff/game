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

// Компонент для выполнения инициализации с учетом данных пользователя
function AppInitializer({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  
  useEffect(() => {
    // Инициализируем персонажа с приоритизацией данных из Clerk
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

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ClerkProvider {...pageProps}>
      <Provider store={store}>
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
        <AnimatePresence mode="wait" initial={false}>
          <AppInitializer>
            <Component {...pageProps} key={router.route} />
          </AppInitializer>
        </AnimatePresence>
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
      </Provider>
    </ClerkProvider>
  );
}

export default MyApp; 