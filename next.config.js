/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Настройка для работы с сервером
  distDir: '.next',
  images: {
    domains: ['localhost', 'via.placeholder.com', 'images.clerk.dev'],
    unoptimized: true, // Отключаем оптимизацию для простоты работы в Docker
  },
  experimental: {
    // Удаляем устаревшую настройку appDir
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