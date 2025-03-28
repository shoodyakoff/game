import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';
import connectDB from '../../../server/config/db';
import User from '../../../server/models/User';

/**
 * API эндпоинт для принудительного обновления сессии
 * Получает актуальные данные пользователя из базы данных
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Устанавливаем заголовки для предотвращения кэширования
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    // Получаем текущую сессию
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Не авторизован' 
      });
    }
    
    // Подключаемся к базе данных
    await connectDB();
    
    // Получаем актуальные данные пользователя
    const user = await (User as any).findById(session.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Пользователь не найден' 
      });
    }
    
    // Возвращаем актуальные данные
    return res.status(200).json({
      success: true,
      message: 'Данные сессии получены',
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        image: user.avatar,
        role: user.role,
        hasCharacter: user.hasCharacter || false,
        characterType: user.characterType || '',
        metadata: user.metadata || {}
      },
      // Данные для отладки
      debug: process.env.NODE_ENV === 'development' ? {
        sessionUserId: session.user.id,
        sessionHasCharacter: session.user.hasCharacter,
        dbUserId: user._id.toString(),
        dbHasCharacter: user.hasCharacter
      } : undefined
    });
  } catch (error: any) {
    console.error('Ошибка при обновлении сессии:', error);
    
    return res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера: ' + error.message 
    });
  }
} 