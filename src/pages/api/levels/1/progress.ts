import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Проверка авторизации
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Необходима авторизация' });
  }

  // Только метод POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  try {
    const { stage, progress, decisions = [] } = req.body;

    // Проверяем обязательные поля
    if (stage === undefined || progress === undefined) {
      return res.status(400).json({ error: 'Не указаны обязательные поля: stage, progress' });
    }

    // В реальной реализации здесь мы бы сохраняли прогресс в базе данных
    // Сейчас просто имитируем успешное сохранение
    console.log(`Сохранение прогресса для пользователя ${session.user.email}: уровень 1, этап ${stage}, прогресс ${progress}%, решения:`, decisions);

    // Возвращаем обновленный статус прогресса
    return res.status(200).json({
      success: true,
      stage,
      progress,
      decisions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ошибка при сохранении прогресса:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
} 