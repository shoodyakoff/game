const mongoose = require('mongoose');

// Функция для подключения к базе данных
const connectDB = async () => {
  try {
    // Проверяем разные варианты переменных окружения
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI не найден в переменных окружения. Укажите MONGODB_URI или MONGO_URI.');
    }
    
    console.log('Попытка подключения к MongoDB...');
    
    const connection = await mongoose.connect(mongoURI);
    
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
    
    // В продакшене не выходим из процесса, а просто сообщаем об ошибке
    if (process.env.NODE_ENV === 'production') {
      console.error('Критическая ошибка подключения к базе данных в продакшене.');
    } else {
      process.exit(1);
    }
    
    throw err;
  }
};

module.exports = connectDB; 