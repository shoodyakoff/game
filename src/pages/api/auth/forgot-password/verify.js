import connectDB from '../../../../server/config/db';
import { verifyResetToken } from '../../../../server/controllers/password';

// Обработчик запроса на проверку токена восстановления пароля
export default async function handler(req, res) {
  // Подключаемся к базе данных
  await connectDB();

  // Разрешаем только GET-запросы
  if (req.method === 'GET') {
    return verifyResetToken(req, res);
  }

  // Если метод не GET, возвращаем ошибку
  res.setHeader('Allow', ['GET']);
  res.status(405).json({ success: false, message: `Метод ${req.method} не разрешен` });
} 