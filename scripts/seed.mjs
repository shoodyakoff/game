/**
 * Скрипт для заполнения базы данных тестовыми данными
 * Запуск: node scripts/seed.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../src/server/config/db.js';
import User from '../src/server/models/User.js';

// Создаем тестовые данные для пользователей
const seedUsers = [
  {
    username: 'testuser',
    email: 's.hoodyakoff@gmail.com',
    password: 'Test123!',  // Будет хешироваться
    role: 'user',
    hasCharacter: true,
    fullName: 'Тестовый Пользователь',
    bio: 'Это тестовый пользователь для локальной разработки'
  },
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin',
    hasCharacter: true,
    fullName: 'Администратор',
    bio: 'Тестовый администратор для локальной разработки'
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 Подключение к базе данных...');
    
    // Подключаемся к базе данных
    await connectDB();
    
    // Очищаем текущие коллекции
    console.log('🗑️ Очистка существующих данных...');
    await User.deleteMany({});
    
    // Хешируем пароли пользователей
    console.log('🔐 Создание тестовых пользователей...');
    const hashedUsers = await Promise.all(
      seedUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );
    
    // Создаем пользователей
    await User.create(hashedUsers);
    
    console.log('✅ База данных заполнена тестовыми данными');
    
    // Выводим информацию о созданных пользователях (без паролей)
    const users = await User.find({}).select('-password');
    console.log('\n👤 Созданные пользователи:');
    console.log(users);
    
    console.log('\n🎮 Для входа используйте:');
    console.log('   📧 s.hoodyakoff@gmail.com / Test123!');
    console.log('   📧 admin@example.com / Admin123!');
    
    // Завершаем работу скрипта
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка при заполнении базы данных:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Запускаем заполнение БД
seedDatabase();