import connectDB from '../../../server/config/db';
import { protect } from '../../../server/middleware/auth';
import User from '../../../server/models/User';

// Обработчик запроса на создание персонажа
export default async function handler(req, res) {
  // Подключаемся к базе данных
  await connectDB();

  // Разрешаем только POST-запросы
  if (req.method === 'POST') {
    try {
      // Применяем middleware для проверки аутентификации
      await new Promise((resolve, reject) => {
        protect(req, res, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      
      // В будущем здесь будет создание персонажа 
      // Сейчас просто обновляем флаг hasCharacter у пользователя
      
      // Получаем пользователя
      const user = await User.findById(req.user._id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Пользователь не найден'
        });
      }
      
      // Обновляем флаг наличия персонажа
      user.hasCharacter = true;
      await user.save();
      
      // Возвращаем успешный ответ
      return res.status(200).json({
        success: true,
        message: 'Персонаж успешно создан',
        data: {
          hasCharacter: true
        }
      });
    } catch (error) {
      console.error('Ошибка создания персонажа:', error);
      return res.status(401).json({
        success: false,
        message: 'Ошибка аутентификации или создания персонажа'
      });
    }
  }

  // Если метод не POST, возвращаем ошибку
  res.setHeader('Allow', ['POST']);
  res.status(405).json({ success: false, message: `Метод ${req.method} не разрешен` });
} 