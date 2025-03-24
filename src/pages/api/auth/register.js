import connectDB from '../../../server/config/db';
import { register } from '../../../server/controllers/auth';

// Обработчик для маршрута регистрации
export default async function handler(req, res) {
  // Подключаемся к базе данных
  await connectDB();

  // Разрешаем только POST-запросы
  if (req.method === 'POST') {
    return register(req, res);
  }

  // Если метод не POST, возвращаем ошибку
  res.setHeader('Allow', ['POST']);
  res.status(405).json({ success: false, message: `Метод ${req.method} не разрешен` });
} 