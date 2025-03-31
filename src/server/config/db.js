const mongoose = require('mongoose');

// Функция для подключения к базе данных
const connectDB = async () => {
  // Если установлен флаг пропуска проверки MongoDB, возвращаем заглушку
  if (process.env.SKIP_MONGODB_CHECK === 'true') {
    console.log('SKIP_MONGODB_CHECK=true: Пропуск проверки подключения к MongoDB');
    // Возвращаем заглушку соединения, чтобы не блокировать работу приложения
    return {
      connection: {
        host: 'mongodb-mock-connection',
        // Базовые методы для имитации соединения
        on: () => {},
        once: () => {}
      }
    };
  }

  try {
    // Проверяем разные варианты переменных окружения
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoURI) {
      console.error('MongoDB URI не найден в переменных окружения. Укажите MONGODB_URI или MONGO_URI.');
      if (process.env.NODE_ENV === 'production') {
        // В продакшене возвращаем заглушку вместо падения
        return {
          connection: {
            host: 'mongodb-missing-uri',
            on: () => {},
            once: () => {}
          }
        };
      } else {
        throw new Error('MongoDB URI не найден в переменных окружения. Укажите MONGODB_URI или MONGO_URI.');
      }
    }
    
    console.log('Попытка подключения к MongoDB...');
    
    const connection = await mongoose.connect(mongoURI, {
      // Увеличиваем таймауты для более стабильного подключения
      serverSelectionTimeoutMS: 10000, // 10 секунд вместо 30 (по умолчанию)
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    });
    
    console.log(`MongoDB подключена: ${connection.connection.host}`);
    
    return connection;
  } catch (err) {
    console.error(`Ошибка подключения к MongoDB: ${err.message}`);
    
    // Дополнительная информация для отладки
    if (err.name === 'MongoParseError') {
      console.error('Неверный формат строки подключения MongoDB.');
    } else if (err.name === 'MongoNetworkError') {
      console.error('Проблема с сетевым подключением к MongoDB. Проверьте сетевые настройки и доступность сервера.');
    }
    
    // В продакшене не выходим из процесса и не бросаем ошибку
    if (process.env.NODE_ENV === 'production') {
      console.error('Критическая ошибка подключения к базе данных в продакшене, но приложение продолжит работу.');
      // Возвращаем заглушку для продолжения работы приложения
      return {
        connection: {
          host: 'mongodb-error-connection',
          on: () => {},
          once: () => {}
        }
      };
    } else {
      // В режиме разработки можно падать для отладки
      process.exit(1);
    }
  }
};

module.exports = connectDB; 