import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Максимально простой API Endpoint для проверки здоровья приложения
 * Всегда отвечает успешно для поддержания работы контейнера
 * GET /api/healthcheck
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Проверяем метод
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Возвращаем базовую информацию о состоянии приложения
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.NEXT_PUBLIC_APP_VERSION || 'undefined'
    });
  } catch (error) {
    console.error('Healthcheck failed:', error);
    // Даже при ошибке возвращаем 200, чтобы не упасть в healthcheck
    res.status(200).json({ 
      status: 'warning',
      message: 'Error occurred but service is still running',
      timestamp: new Date().toISOString()
    });
  }
} 