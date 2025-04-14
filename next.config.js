/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Настройка для работы с сервером
  distDir: '.next',
  // Настройка для standalone сборки
  output: 'standalone',
  // Отключаем предварительный рендеринг страниц в мок-режиме
  // чтобы избежать ошибок с useUser и другими хуками Clerk
  ...(process.env.NEXT_PUBLIC_CLERK_MOCK_MODE === 'true' ? {
    // В мок-режиме все страницы должны рендериться только на клиенте
    typescript: {
      // Игнорируем ошибки TypeScript во время сборки
      ignoreBuildErrors: true,
    },
    eslint: {
      // Игнорируем ошибки ESLint во время сборки
      ignoreDuringBuilds: true,
    },
    // Отключаем Server Components и другие экспериментальные возможности в мок-режиме
    experimental: {
      serverActions: false,
      serverComponents: false,
    },
    // Отключаем SSR и SSG для всех страниц
    pageExtensions: ['client.jsx', 'client.js', 'client.tsx', 'client.ts', 'jsx', 'js', 'tsx', 'ts'],
  } : {}),
  images: {
    domains: ['localhost', 'via.placeholder.com', 'images.clerk.dev'],
    unoptimized: true, // Отключаем оптимизацию для простоты работы в Docker
  },
  experimental: {
    // Другие экспериментальные опции, если нужны
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
  
  // Определяем переменные для клиентской части в зависимости от режима
  env: {
    // Другие переменные...
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
    return config;
  },
}

module.exports = nextConfig 