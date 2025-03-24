const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

// Middleware для защиты маршрутов
const protect = async (req, res, next) => {
  let token;

  // Проверяем наличие токена в заголовке Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Получаем токен из заголовка
      token = req.headers.authorization.split(' ')[1];

      // Проверяем токен
      const { valid, expired, decoded } = verifyToken(token);

      if (!valid) {
        return res.status(401).json({
          success: false,
          message: expired ? 'Токен истек' : 'Недействительный токен'
        });
      }

      // Получаем пользователя по ID из токена
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Пользователь не найден'
        });
      }

      // Добавляем пользователя в запрос
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Ошибка аутентификации'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Доступ запрещен, токен не предоставлен'
    });
  }
};

// Middleware для проверки роли
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'У вас нет прав для выполнения этого действия'
      });
    }
    next();
  };
};

module.exports = { protect, authorize }; 