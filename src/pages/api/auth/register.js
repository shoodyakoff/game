import connectDB from '../../../server/config/db';
import User from '../../../server/models/User';

// Обработчик для маршрута регистрации
export default async function handler(req, res) {
  // Устанавливаем CORS заголовки для разрешения локальных запросов
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Для OPTIONS запросов возвращаем 200
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Подключаемся к базе данных
  await connectDB();

  // Разрешаем только POST-запросы
  if (req.method === 'POST') {
    try {
      console.log('Получен запрос на регистрацию:', req.body);
      const { username, email, password } = req.body;
      
      // Проверяем наличие всех полей
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Все поля формы обязательны'
        });
      }

      // Проверяем корректность email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Введите корректный email адрес'
        });
      }

      // Проверяем длину имени пользователя
      if (username.length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Имя пользователя должно содержать не менее 3 символов'
        });
      }

      // Проверяем длину пароля
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Пароль должен содержать не менее 6 символов'
        });
      }

      // Проверяем сложность пароля (содержит цифру и специальный символ)
      const hasNumber = /\d/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      if (!hasNumber || !hasSpecial) {
        return res.status(400).json({
          success: false,
          message: 'Пароль должен содержать хотя бы одну цифру и один специальный символ'
        });
      }

      // Проверка на существование пользователя с таким email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Пользователь с таким email уже существует'
        });
      }

      // Проверка на существование пользователя с таким именем
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'Пользователь с таким именем уже существует'
        });
      }

      // Создание пользователя
      console.log('Создание пользователя в базе данных...');
      const user = await User.create({
        username,
        email,
        password,
        avatar: '/images/characters/icons/default.png'
      });
      console.log('Пользователь создан:', user._id);

      // Обновляем дату последнего входа
      user.last_login = Date.now();
      await user.save();

      // Отправляем ответ
      res.status(201).json({
        success: true,
        message: 'Регистрация успешно завершена',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          hasCharacter: user.hasCharacter || false
        }
      });
    } catch (error) {
      console.error('Ошибка регистрации:', error.message);
      console.error('Полная ошибка:', error);
      
      res.status(500).json({
        success: false,
        message: 'Ошибка сервера при регистрации: ' + error.message
      });
    }
  } else {
    // Если метод не POST, возвращаем ошибку
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ success: false, message: `Метод ${req.method} не разрешен` });
  }
} 