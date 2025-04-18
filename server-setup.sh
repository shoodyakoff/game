#!/bin/bash

# Скрипт для настройки и запуска приложения на сервере в реальном режиме (без моков)
# Этот скрипт выполняет следующие действия:
# 1. Обновляет код из репозитория
# 2. Назначает права на выполнение скриптов
# 3. Останавливает запущенные контейнеры
# 4. Создает docker-compose.override.yml с переменными окружения для продакшена
# 5. Собирает и запускает контейнеры
# 6. Проверяет статус

set -e

echo "🔄 Обновление кода из репозитория..."
git pull origin main

echo "🔑 Назначение прав на выполнение скриптов..."
chmod +x *.sh

echo "🛑 Остановка существующих контейнеров..."
docker-compose -f docker-compose.prod.yml down --remove-orphans || true

echo "🧹 Очистка Docker..."
docker system prune -f

echo "📝 Создание docker-compose.override.yml с переменными окружения..."
cat > docker-compose.override.yml << EOL
version: '3.8'

services:
  nextjs-app:
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dHJ1ZS1nb2xkZmlzaC04MS5jbGVyay5hY2NvdW50cy5kZXYk
      - CLERK_SECRET_KEY=sk_test_7Wb9VikhkBTuO4O6YUjVVCmxQB5wtAvX8V79kubHMi
      - NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
      - NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
      - NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
      - NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select
      - NEXT_PUBLIC_CLERK_MOCK_MODE=false
      - NEXT_PUBLIC_CLERK_NO_VERIFICATION=true
EOL

# Создаем .env файл с правильными переменными окружения
echo "📝 Создание .env файла с реальными ключами Clerk..."
cat > .env << EOL
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dHJ1ZS1nb2xkZmlzaC04MS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_7Wb9VikhkBTuO4O6YUjVVCmxQB5wtAvX8V79kubHMi
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select
NEXT_PUBLIC_CLERK_MOCK_MODE=false
NEXT_PUBLIC_CLERK_NO_VERIFICATION=true
EOL

echo "🏗️ Сборка и запуск контейнеров..."
docker-compose -f docker-compose.prod.yml up -d --build

echo "📊 Проверка статуса контейнеров..."
docker-compose -f docker-compose.prod.yml ps

echo "✅ Настройка завершена!"
echo "🌐 Приложение доступно по адресу: http://your-server-ip:3000"
echo "📋 Для просмотра логов используйте: docker-compose -f docker-compose.prod.yml logs -f nextjs-app" 