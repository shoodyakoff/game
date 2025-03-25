import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import connectDB from '../../../server/config/db';
import User from '../../../server/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Проверяем метод запроса
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: `Метод ${req.method} не разрешен` });
  }

  try {
    // Получаем сессию и проверяем авторизацию
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user) {
      return res.status(401).json({ success: false, message: 'Не авторизован' });
    }

    // Подключаемся к базе данных
    await connectDB();

    // Получаем данные из тела запроса
    const { characterId, characterType } = req.body;

    // Проверяем наличие необходимых данных
    if (!characterId || !characterType) {
      return res.status(400).json({ success: false, message: 'ID персонажа и тип обязательны' });
    }

    // Находим пользователя по ID из сессии
    const userId = session.user.id;
    const user = await (User as any).findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    // Обновляем данные пользователя
    user.hasCharacter = true;
    user.role = characterType;
    user.updated_at = new Date();

    // Сохраняем обновленные данные
    await user.save();

    // Возвращаем успешный ответ с обновленными данными
    return res.status(200).json({
      success: true,
      message: 'Персонаж успешно выбран',
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        image: user.avatar,
        role: user.role,
        hasCharacter: user.hasCharacter
      }
    });
  } catch (error: any) {
    console.error('Ошибка при выборе персонажа:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 