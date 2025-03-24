import connectDB from '../../../server/config/db';
import { getMe } from '../../../server/controllers/auth';
import { protect } from '../../../server/middleware/auth';

// Обработчик для маршрута получения данных пользователя
export default async function handler(req, res) {
  // Подключаемся к базе данных
  await connectDB();

  // Разрешаем только GET-запросы
  if (req.method === 'GET') {
    // Применяем middleware для проверки аутентификации
    try {
      await new Promise((resolve, reject) => {
        protect(req, res, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      
      // Если middleware пройден успешно, вызываем контроллер
      return getMe(req, res);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Ошибка аутентификации'
      });
    }
  }

  // Если метод не GET, возвращаем ошибку
  res.setHeader('Allow', ['GET']);
  res.status(405).json({ success: false, message: `Метод ${req.method} не разрешен` });
} 