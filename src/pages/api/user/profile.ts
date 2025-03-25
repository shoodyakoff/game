import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import connectDB from '../../../server/config/db';
import User from '../../../server/models/User';

// API-маршрут для обновления профиля пользователя
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Проверяем метод запроса
  if (req.method !== 'PUT') {
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
    const { name, email, fullName, bio } = req.body;

    // Проверяем наличие email как минимум
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email обязателен' });
    }

    // Находим пользователя по ID из сессии
    const userId = session.user.id;
    const user = await (User as any).findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    // Проверяем, не занят ли email другим пользователем
    if (email !== user.email) {
      const existingUser = await (User as any).findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Этот email уже используется' });
      }
    }

    // Обновляем данные пользователя
    if (name) user.username = name; // Сохраняем в поле username для совместимости
    if (email) user.email = email;
    if (fullName !== undefined) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;
    user.updated_at = new Date();

    // Сохраняем обновленные данные
    await user.save();

    // Отправляем обновленного пользователя в ответе
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.username, // Возвращаем username как name для NextAuth
        email: user.email,
        image: user.avatar,
        fullName: user.fullName || '',
        bio: user.bio || '',
        role: user.role,
        hasCharacter: user.hasCharacter || false
      }
    });
  } catch (error: any) {
    console.error('Ошибка при обновлении профиля:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 