// Этот скрипт выполняется при запуске MongoDB в Docker
// Он создает начальные коллекции и тестового пользователя

print('🚀 Начинаем инициализацию MongoDB для Game Portal...');

// Переключаемся на базу данных проекта
db = db.getSiblingDB('game-portal');

// Создаем пользователя MongoDB с ограниченными правами
db.createUser({
  user: 'gameapp',
  pwd: 'app_password_' + Math.random().toString(36).slice(2),
  roles: [
    { role: 'readWrite', db: 'game-portal' }
  ]
});

print('✅ Создан пользователь MongoDB с ограниченными правами');

// Создаем начальные коллекции
db.createCollection('users');
print('✅ Коллекция users создана');

// Создание сильных хешей паролей для тестовых пользователей
// Эти хеши сгенерированы с высокой стоимостью для bcrypt (12 раундов)
const testUserPasswordHash = '$2a$12$Jq.L7SdzHiFZcXnNwA9HR.XzXP3bb00gPP6eGz7o967XvK8jPDTze'; // Test123!
const adminPasswordHash = '$2a$12$xc3ZhP59X3kxTH/qVwZYpuePZWvQrLONKKZ9GguiPZGEqGYBL2HWG'; // Admin123!

// Добавляем тестового пользователя
db.users.insertOne({
  username: 'testuser',
  email: 's.hoodyakoff@gmail.com',
  password: testUserPasswordHash,
  avatar: '/images/characters/icons/default.png',
  role: 'user',
  created_at: new Date(),
  updated_at: new Date(),
  hasCharacter: true,
  fullName: 'Тестовый Пользователь',
  bio: 'Это тестовый пользователь для локальной разработки'
});

// Добавляем тестового пользователя с ролью админа
db.users.insertOne({
  username: 'admin',
  email: 'admin@example.com',
  password: adminPasswordHash,
  avatar: '/images/characters/icons/admin.png',
  role: 'admin',
  created_at: new Date(),
  updated_at: new Date(),
  hasCharacter: true,
  fullName: 'Администратор',
  bio: 'Тестовый администратор для локальной разработки'
});

print('✅ Тестовые пользователи созданы:');
print('   📧 s.hoodyakoff@gmail.com / Test123!');
print('   📧 admin@example.com / Admin123!');

// Создаем индексы для повышения производительности и безопасности
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
print('✅ Созданы индексы для повышения производительности');

// Выводим информацию о созданных пользователях (без паролей)
print('\n👤 Информация о пользователях:');
var users = db.users.find({}, { password: 0 }).toArray();
printjson(users);

print('\n✨ Инициализация MongoDB завершена успешно!');
print('🎮 Game Portal готов к локальной разработке.'); 