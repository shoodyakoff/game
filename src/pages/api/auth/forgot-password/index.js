import connectDB from '../../../../server/config/db';
import { forgotPassword } from '../../../../server/controllers/password';

// Обработчик запроса на восстановление пароля
export default async function handler(req, res) {
  // Подключаемся к базе данных
  await connectDB();

  // Разрешаем только POST-запросы
  if (req.method === 'POST') {
    return forgotPassword(req, res);
  }

  // Если метод не POST, возвращаем ошибку
  res.setHeader('Allow', ['POST']);
  res.status(405).json({ success: false, message: `Метод ${req.method} не разрешен` });
} 