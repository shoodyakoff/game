/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Настройки для обработки изображений
  images: {
    domains: ['localhost'],
  },
  // Настройки для API роутов
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      }
    ]
  },
}

module.exports = nextConfig 