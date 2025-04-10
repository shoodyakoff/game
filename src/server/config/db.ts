import mongoose from 'mongoose';

// Глобальный кеш соединений
interface ConnectionCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Объявление глобальной переменной для HMR и кеширования
declare global {
  var mongoose: ConnectionCache | undefined;
}

// Используем глобальное хранилище для состояния соединения
const cached: ConnectionCache = global.mongoose || { conn: null, promise: null };
if (process.env.NODE_ENV !== 'production') {
  global.mongoose = cached;
}

/**
 * Создает соединение Mongoose с MongoDB
 * Сохраняет соединение в кеше для повторного использования
 */
async function connectDB(): Promise<mongoose.Connection | null> {
  // Параметры подключения
  const MONGODB_URI = process.env.MONGODB_URI || 
                      process.env.MONGO_URI || 
                      'mongodb://localhost:27017/game-portal';
  
  // 1. Проверяем режим SKIP
  if (process.env.SKIP_MONGODB_CHECK === 'true') {
    console.log('SKIP_MONGODB_CHECK=true: Пропуск подключения к MongoDB');
    return null;
  }
  
  // 2. Используем активное соединение, если оно существует
  if (cached.conn) {
    console.log('Используем существующее соединение MongoDB');
    return cached.conn;
  }
  
  // 3. Создаем новое соединение, если нет активного промиса
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    };
    
    console.log('Создаем новое соединение с MongoDB:', {
      uri: MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'), // Маскируем учетные данные
      options: opts
    });
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Соединение с MongoDB успешно установлено');
        return mongoose.connection;
      })
      .catch((error) => {
        // Сбрасываем промис при ошибке
        cached.promise = null;
        console.error('Ошибка подключения к MongoDB:', {
          name: error.name,
          message: error.message,
          code: error.code
        });
        throw error;
      });
      
    // Настраиваем обработчики событий Mongoose
    mongoose.connection.on('connected', () => {
      console.log('Mongoose: соединение установлено');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose: ошибка соединения -', {
        name: err.name,
        message: err.message,
        code: err.code
      });
      // Сбрасываем кеш при ошибке
      cached.promise = null;
      cached.conn = null;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose: соединение разорвано');
      // Сбрасываем кеш при разрыве соединения
      cached.promise = null;
      cached.conn = null;
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose: соединение закрыто через app termination');
      process.exit(0);
    });
  } else {
    console.log('Ожидание существующего промиса подключения MongoDB');
  }
  
  // 4. Дожидаемся результата подключения
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  
  return cached.conn;
}

// Только ES Module экспорт
export default connectDB; 