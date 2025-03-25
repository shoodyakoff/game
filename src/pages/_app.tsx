import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import store from '../store';
import { checkAuthStatus } from '../store/slices/authSlice';
import { initializeCharacter } from '../store/slices/characterSlice';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';

// Компонент для выполнения инициализации
function AppInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Проверяем статус аутентификации
    store.dispatch(checkAuthStatus());
    // Инициализируем персонажа из localStorage
    store.dispatch(initializeCharacter());
  }, []);

  return <>{children}</>;
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  return (
    <SessionProvider session={session}>
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
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp; 