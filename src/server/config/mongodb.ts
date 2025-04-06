import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dummy-db';
const options = {
  connectTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000,  // 45 seconds
};

let client;
let clientPromise: Promise<MongoClient>;

// Если установлен флаг пропуска проверки MongoDB, возвращаем заглушку
if (process.env.SKIP_MONGODB_CHECK === 'true') {
  console.log('SKIP_MONGODB_CHECK=true: Используется фиктивное подключение к MongoDB');
  // Создаем фиктивный клиент MongoDB для режима без БД
  class MockMongoClient {
    constructor() {}
    connect() { return this; }
    db() { return {}; }
    close() {}
  }
  
  const mockClient = new MockMongoClient() as unknown as MongoClient;
  clientPromise = Promise.resolve(mockClient);
} else if (process.env.NODE_ENV === 'development') {
  // В development режиме используем глобальную переменную для сохранения соединения
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect()
      .catch(error => {
        console.error('MongoDB connection error in development:', {
          name: error.name,
          message: error.message,
          code: error.code
        });
        
        // Создаем фиктивный клиент MongoDB при ошибке
        const mockClient = {
          connect: () => Promise.resolve(mockClient),
          db: () => ({}),
          close: () => {}
        } as unknown as MongoClient;
        
        return mockClient;
      });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // В production создаем новое соединение с обработкой ошибок
  client = new MongoClient(uri, options);
  clientPromise = client.connect()
    .catch(error => {
      console.error('MongoDB connection error in production:', {
        name: error.name,
        message: error.message,
        code: error.code,
        uri: uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') // Маскируем credentials
      });
      
      // Создаем фиктивный клиент MongoDB при ошибке в продакшене
      const mockClient = {
        connect: () => Promise.resolve(mockClient),
        db: () => ({}),
        close: () => {}
      } as unknown as MongoClient;
      
      return mockClient;
    });
}

// Экспортируем промис с подключением
export default clientPromise; 