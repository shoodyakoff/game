import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Максимально простой API Endpoint для проверки здоровья приложения
 * Всегда отвечает успешно для поддержания работы контейнера
 * GET /api/healthcheck
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Всегда отвечаем успешно
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
  });
} 