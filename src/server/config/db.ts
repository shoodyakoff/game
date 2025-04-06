import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dummy-db';

  if (process.env.SKIP_MONGODB_CHECK === 'true') {
    console.log('SKIP_MONGODB_CHECK=true: Пропуск проверки подключения к MongoDB');
    return;
  }

  if (cached.conn) {
    console.log('Используется существующее подключение к MongoDB');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      keepAlive: true,
      keepAliveInitialDelay: 300000
    };

    console.log('Подключение к MongoDB...', {
      uri: MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'), // Маскируем credentials в логах
      options: opts
    });

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Подключение к MongoDB успешно установлено');
      return mongoose;
    }).catch((error) => {
      cached.promise = null;
      console.error('Ошибка подключения к MongoDB:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      throw error;
    });
  } else {
    console.log('Используется существующий промис подключения к MongoDB');
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

// Добавляем обработчики событий для мониторинга соединения
mongoose.connection.on('connected', () => {
  console.log('Mongoose: соединение установлено');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose: ошибка соединения -', {
    name: err.name,
    message: err.message,
    code: err.code
  });
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose: соединение разорвано');
  cached.promise = null;
  cached.conn = null;
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose: соединение закрыто через app termination');
  process.exit(0);
});

export default connectDB; 