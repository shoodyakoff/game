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
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Получаем память и использование CPU
    const memoryUsage = process.memoryUsage();
    
    // Формируем ответ
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbStatus,
      },
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      },
      environment: process.env.NODE_ENV
    };
    
    return res.status(200).json(healthData);
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({ 
      status: 'error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
  }
} 