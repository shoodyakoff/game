/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Убираем output: 'standalone' и настраиваем для обычного режима
  distDir: '.next',
  images: {
    domains: ['localhost'],
    unoptimized: true, // Отключаем оптимизацию для простоты работы в Docker
  },
  // Отключаем генерацию статических страниц для страниц, требующих Clerk
  output: 'export',
  experimental: {
    appDir: false,
  },
  // Исключаем пути с Clerk из статической генерации
  exportPathMap: async function () {
    return {
      '/': { page: '/' }
    }
  },
  // Настройки для безопасности
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
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
}

module.exports = nextConfig 