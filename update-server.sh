#!/bin/bash
# Специальный скрипт для быстрого обновления и устранения ошибок на сервере

set -e  # Останавливаем скрипт при ошибках

echo "🚀 Обновление сервера и исправление проблем с Clerk..."

# Шаг 1: Обновляем код из репозитория
echo "📥 Обновляем код из репозитория..."
git fetch origin
git pull origin main

# Шаг 2: Делаем скрипт патчинга исполняемым
echo "🔐 Делаем скрипты исполняемыми..."
chmod +x patch-clerk-modules.sh

# Шаг 3: Останавливаем контейнеры
echo "🛑 Останавливаем существующие контейнеры..."
docker-compose -f docker-compose.prod.yml down

# Шаг 4: Создаем .env.local с правильными значениями
echo "🔧 Создаем файл .env.local..."
cat > .env.local << EOL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_JA==
CLERK_SECRET_KEY=sk_test_valid_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select
NEXT_PUBLIC_CLERK_MOCK_MODE=true
NEXT_PUBLIC_CLERK_NO_VERIFICATION=true
EOL
echo "✅ Файл .env.local создан!"

# Шаг 5: Запускаем патчинг Clerk 
echo "🩹 Патчим модули Clerk..."
npm ci
./patch-clerk-modules.sh

# Шаг 6: Строим и запускаем контейнеры
echo "🐳 Запускаем Docker в режиме сборки..."
docker-compose -f docker-compose.prod.yml up -d --build

# Шаг 7: Проверяем статус
echo "🔍 Проверяем статус контейнеров..."
docker-compose -f docker-compose.prod.yml ps

echo "
🎉 Обновление завершено! 

Приложение доступно по адресу http://SERVER_IP:3000

Для просмотра логов используйте команду:
docker-compose -f docker-compose.prod.yml logs -f

Для запуска логов сейчас введите 'y' (или любую другую клавишу для выхода):
"
read -r answer
if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
  docker-compose -f docker-compose.prod.yml logs -f
fi 