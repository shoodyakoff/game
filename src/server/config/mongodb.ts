/**
 * MongoDB клиент для прямого доступа к базе данных
 * Этот файл предоставляет клиент MongoDB для использования 
 * в API-маршрутах и других серверных функциях
 */
import { MongoClient } from 'mongodb';
import connectDB from './db';

// Используем те же параметры, что и в основном connectDB
const MONGODB_URI = process.env.MONGODB_URI || 
                   process.env.MONGO_URI || 
                   'mongodb://localhost:27017/game-portal';

// Типизация для глобальных переменных
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Опции подключения для native MongoDB driver
const options = {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000
};

// Результат, который будет экспортирован
let clientPromise: Promise<MongoClient>;

// Используем режим пропуска проверки, если включен
if (process.env.SKIP_MONGODB_CHECK === 'true') {
  console.log('MongoDB: SKIP_MONGODB_CHECK=true, используем заглушку клиента MongoDB');
  
  // Создаем заглушку клиента MongoDB
  const mockClient = {
    connect: () => Promise.resolve(mockClient),
    db: () => ({}),
    close: () => {}
  } as unknown as MongoClient;
  
  clientPromise = Promise.resolve(mockClient);
} else if (process.env.NODE_ENV === 'development') {
  // В режиме разработки кешируем соединение в глобальной переменной
  // для поддержки горячей перезагрузки (HMR)
  if (!global._mongoClientPromise) {
    // Создаем клиент
    const client = new MongoClient(MONGODB_URI, options);
    
    // Сначала пытаемся подключиться через Mongoose (основной файл db.ts)
    // чтобы поддерживать синхронизацию соединений
    global._mongoClientPromise = connectDB()
      .then(() => {
        console.log('MongoDB: Используем соединение после Mongoose');
        return client.connect();
      })
      .catch(error => {
        console.error('MongoDB: Ошибка подключения:', {
          name: error.name,
          message: error.message,
          code: error.code
        });
        throw error;
      });
  }
  
  clientPromise = global._mongoClientPromise;
} else {
  // В продакшене создаем новый клиент (будет вызываться один раз на запрос)
  const client = new MongoClient(MONGODB_URI, options);
  
  clientPromise = connectDB()
    .then(() => {
      console.log('MongoDB: Подключаемся к базе в режиме production');
      return client.connect();
    })
    .catch(error => {
      console.error('MongoDB: Ошибка при подключении:', {
        name: error.name,
        message: error.message,
        code: error.code
      });
      throw error;
    });
}

// Только ES Module экспорт
export default clientPromise; 