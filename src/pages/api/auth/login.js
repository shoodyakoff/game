import connectDB from '../../../server/config/db';
import User from '../../../server/models/User';
import { generateToken } from '../../../server/utils/jwt';

// Обработчик для маршрута входа
export default async function handler(req, res) {
  // Устанавливаем CORS заголовки для разрешения локальных запросов
  const origin = req.headers.origin || 'http://localhost:3000';
  
  // В режиме разработки разрешаем запросы с любых источников
  if (process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Обработка OPTIONS запроса (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Подключаемся к базе данных
    await connectDB();
    
    // Для GET запросов возвращаем простой ответ
    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        message: 'API входа работает, используйте POST для аутентификации'
      });
    }
    
    // Если метод POST, обрабатываем вход
    if (req.method === 'POST') {
      console.log('Получен POST-запрос на /api/auth/login');
      console.log('URL запроса:', req.url);
      console.log('Заголовки:', req.headers);
      console.log('Тело запроса:', req.body);
      console.log('Метод запроса:', req.method);
      
      // Проверка ошибок разбора JSON
      if (typeof req.body === 'string') {
        try {
          req.body = JSON.parse(req.body);
        } catch (err) {
          console.error('Ошибка разбора JSON тела запроса:', err);
          return res.status(400).json({
            success: false,
            message: 'Неверный формат JSON в теле запроса'
          });
        }
      }
      
      const { email, password } = req.body;
      
      // Проверяем наличие обязательных полей
      if (!email || !password) {
        console.log('Отсутствуют обязательные данные:', { email: !!email, password: !!password });
        return res.status(400).json({
          success: false,
          message: 'Email и пароль обязательны'
        });
      }
      
      // Ищем пользователя по email
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Неверный email или пароль'
        });
      }
      
      // Проверяем пароль
      const isMatch = await user.matchPassword(password);
      
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Неверный email или пароль'
        });
      }
      
      // Обновляем время последнего входа
      user.last_login = new Date();
      await user.save();
      
      // Генерируем JWT токен
      const token = generateToken(user._id);
      
      // Возвращаем данные пользователя и токен
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          hasCharacter: user.hasCharacter || false
        }
      });
    }
    
    // Для других методов возвращаем ошибку
    return res.status(405).json({
      success: false,
      message: `Метод ${req.method} не поддерживается`
    });
  } catch (error) {
    console.error('Ошибка API /auth/login:', error);
    
    // Возвращаем серверную ошибку
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 