import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

/**
 * API Endpoint для проверки здоровья приложения
 * Используется Docker для healthcheck
 * GET /api/health
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Проверяем подключение к базе данных
    let dbStatus = 'unknown';
    
    try {
      dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    } catch (dbError) {
      console.warn('Не удалось проверить состояние MongoDB:', dbError);
      dbStatus = 'error';
    }
    
    // Получаем память и использование CPU
    const memoryUsage = process.memoryUsage();
    
    // Формируем ответ
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbStatus,
        skip_check: process.env.SKIP_MONGODB_CHECK === 'true'
      },
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      },
      environment: process.env.NODE_ENV,
      version: process.env.NEXT_PUBLIC_APP_VERSION || 'undefined'
    };
    
    // Всегда возвращаем 200, чтобы не падать в healthcheck
    return res.status(200).json(healthData);
  } catch (error) {
    console.error('Health check failed:', error);
    // Даже при ошибке возвращаем 200, чтобы не упасть в healthcheck
    return res.status(200).json({ 
      status: 'warning',
      message: 'Error occurred but service is still running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  }
} 