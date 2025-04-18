/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Настройка для работы с сервером
  distDir: '.next',
  // Настройка для standalone сборки
  output: 'standalone',
  // Всегда игнорируем ошибки TypeScript и ESLint
  typescript: {
    // Игнорируем ошибки TypeScript во время сборки
    ignoreBuildErrors: true,
  },
  eslint: {
    // Игнорируем ошибки ESLint во время сборки
    ignoreDuringBuilds: true,
  },
  // Включаем папку с типами в сборку
  transpilePackages: ['types'],
  // Отключаем предварительный рендеринг страниц в мок-режиме
  // чтобы избежать ошибок с useUser и другими хуками Clerk
  ...(process.env.NEXT_PUBLIC_CLERK_MOCK_MODE === 'true' ? {
    // В мок-режиме все страницы должны рендериться только на клиенте
    experimental: {
      serverActions: false,
      serverComponents: false,
      runtime: 'nodejs',
    },
    // Отключаем SSR и SSG для всех страниц
    pageExtensions: ['client.jsx', 'client.js', 'client.tsx', 'client.ts', 'jsx', 'js', 'tsx', 'ts'],
    // Отключаем предварительный рендеринг
    images: {
      unoptimized: true,
    },
  } : {}),
  images: {
    domains: ['localhost', 'via.placeholder.com', 'images.clerk.dev'],
    unoptimized: true, // Отключаем оптимизацию для простоты работы в Docker
  },
  // Настройки для API роутов
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/characters/:path*',
        destination: '/characters/:path*',
        has: [
          {
            type: 'header',
            key: 'Accept',
            value: 'image/(.*)'
          }
        ]
      }
    ]
  },
  
  // Определяем переменные для клиентской части
  env: {
    // Добавляем переменные Clerk для распознавания во время сборки
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in',
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '/sign-up',
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/dashboard',
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/character/select',
    NEXT_PUBLIC_CLERK_MOCK_MODE: process.env.NEXT_PUBLIC_CLERK_MOCK_MODE || 'false',
    NEXT_PUBLIC_CLERK_NO_VERIFICATION: process.env.NEXT_PUBLIC_CLERK_NO_VERIFICATION || 'true',
  },
  
  // Оптимизируем бандл для production
  webpack(config, { dev, isServer }) {
    // Оптимизация только для production
    if (!dev && !isServer) {
      Object.assign(config.optimization.splitChunks.cacheGroups, {
        commons: {
          name: 'commons',
          chunks: 'all',
          priority: 1,
        },
      });
    }
    
    // Фикс для Edge Runtime и проблемных модулей
    if (isServer) {
      // Игнорируем проблемные модули
      config.externals = [...(config.externals || []), 'scheduler'];
    }
    
    // Игнорируем ошибки импорта для модулей Clerk
    if (process.env.NEXT_PUBLIC_CLERK_MOCK_MODE === 'true') {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@clerk/shared': false,
        '@clerk/nextjs': false,
        '@clerk/clerk-react': false,
      };
      
      // Исключаем проверку ESM модулей Clerk
      config.module.rules.push({
        test: /node_modules\/@clerk\/shared\/dist\/.*\.mjs$/,
        resolve: {
          fullySpecified: false, // отключаем строгую проверку ESM для этих модулей
        },
      });
    }
    
    return config;
  },
}

// Выводим диагностическую информацию при сборке
console.log('💡 Next.js config:', {
  mockMode: process.env.NEXT_PUBLIC_CLERK_MOCK_MODE,
  hasPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  envVarsCount: Object.keys(process.env).filter(k => k.includes('CLERK')).length,
  buildMode: process.env.NODE_ENV
});

module.exports = nextConfig 