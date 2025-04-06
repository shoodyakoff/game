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
        once: () => {},
        readyState: 1
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
            once: () => {},
            readyState: 0
          }
        };
      } else {
        throw new Error('MongoDB URI не найден в переменных окружения. Укажите MONGODB_URI или MONGO_URI.');
      }
    }
    
    console.log('Попытка подключения к MongoDB...');
    
    const connection = await mongoose.connect(mongoURI, {
      // Увеличиваем таймауты для более стабильного подключения
      serverSelectionTimeoutMS: 10000, // 10 секунд
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      // Дополнительные опции
      maxPoolSize: 10,
      minPoolSize: 1,
      keepAlive: true,
      keepAliveInitialDelay: 300000
    });
    
    console.log(`MongoDB подключена: ${connection.connection.host}`);
    
    // Настройка обработчиков событий для мониторинга соединения
    mongoose.connection.on('error', (err) => {
      console.error('Ошибка соединения MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB отключена');
    });
    
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB соединение закрыто (SIGINT)');
      process.exit(0);
    });
    
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
          once: () => {},
          readyState: 0
        }
      };
    } else {
      // В режиме разработки возвращаем ошибку вместо выхода
      console.error('Ошибка подключения к MongoDB в режиме разработки');
      return {
        connection: {
          host: 'mongodb-error-connection-dev',
          on: () => {},
          once: () => {},
          readyState: 0
        }
      };
    }
  }
};

module.exports = connectDB; 