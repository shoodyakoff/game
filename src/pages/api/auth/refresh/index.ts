import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]';
import connectDB from '../../../../server/config/db';
import User from '../../../../server/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Только GET запросы
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: `Метод ${req.method} не разрешен` });
  }
  
  // Устанавливаем заголовки для предотвращения кэширования ответа
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  try {
    // Получаем текущую сессию
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user) {
      return res.status(401).json({ success: false, message: 'Не авторизован' });
    }
    
    // Подключаемся к БД и получаем актуальные данные пользователя
    await connectDB();
    
    const user = await User.findById(session.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }
    
    // Обновляем данные в сессии
    // Примечание: NextAuth не обновит JWT токен напрямую здесь
    // API просто возвращает актуальные данные, которые клиент может использовать
    
    return res.status(200).json({
      success: true,
      message: 'Данные сессии обновлены',
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        hasCharacter: user.hasCharacter,
        role: user.role,
        characterType: user.characterType || (user.metadata?.characterType)
      }
    });
  } catch (error: any) {
    console.error('Ошибка при обновлении сессии:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера: ' + error.message
    });
  }
} 