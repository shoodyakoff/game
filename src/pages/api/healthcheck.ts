import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Упрощенный API Endpoint для проверки здоровья приложения
 * Не требует подключения к базе данных
 * GET /api/healthcheck
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Получаем память и использование CPU
    const memoryUsage = process.memoryUsage();
    
    // Формируем ответ
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      },
      environment: process.env.NODE_ENV || 'production'
    };
    
    return res.status(200).json(healthData);
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({ 
      status: 'error',
      error: 'Internal Server Error'
    });
  }
} 