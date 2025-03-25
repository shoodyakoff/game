import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import connectDB from '../../../server/config/db';
import User from '../../../server/models/User';

// API-маршрут для обновления пароля пользователя
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

    // Получаем текущий и новый пароль из тела запроса
    const { currentPassword, newPassword } = req.body;

    // Проверяем наличие обоих паролей
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Оба пароля обязательны' });
    }
    
    // Проверяем длину нового пароля
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Новый пароль должен содержать минимум 8 символов' });
    }
    
    // Проверяем сложность пароля (содержит цифру и специальный символ)
    const hasNumber = /\d/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    
    if (!hasNumber || !hasSpecial) {
      return res.status(400).json({ 
        success: false, 
        message: 'Пароль должен содержать хотя бы одну цифру и один специальный символ' 
      });
    }

    // Находим пользователя по ID из сессии и включаем поле password
    const userId = session.user.id;
    const user = await (User as any).findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    // Проверяем соответствие текущего пароля
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Текущий пароль неверен' });
    }

    // Устанавливаем новый пароль
    user.password = newPassword;
    user.updated_at = new Date();

    // Сохраняем обновленные данные
    await user.save();

    // Возвращаем успешный ответ
    return res.status(200).json({
      success: true,
      message: 'Пароль успешно обновлен'
    });
  } catch (error: any) {
    console.error('Ошибка при обновлении пароля:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 