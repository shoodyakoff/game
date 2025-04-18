#!/bin/bash

# Скрипт для настройки и запуска приложения на сервере в реальном режиме (без моков)
# Этот скрипт выполняет следующие действия:
# 1. Назначает права на выполнение скриптов
# 2. Останавливает запущенные контейнеры
# 3. Создает docker-compose.override.yml с переменными окружения для продакшена
# 4. Собирает и запускает контейнеры
# 5. Проверяет статус

set -e

# Проверка флага быстрого запуска
REBUILD=${REBUILD:-true}

echo "🔑 Назначение прав на выполнение скриптов..."
chmod +x *.sh

echo "🧐 Проверка наличия переменных окружения..."
if [ -z "$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" ]; then
  echo "⚠️ ВНИМАНИЕ: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY не установлен!"
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_dHJ1ZS1nb2xkZmlzaC04MS5jbGVyay5hY2NvdW50cy5kZXYk"
  echo "✅ Установлено значение по умолчанию."
else
  echo "✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY установлен."
fi

if [ -z "$CLERK_SECRET_KEY" ]; then
  echo "⚠️ ВНИМАНИЕ: CLERK_SECRET_KEY не установлен!"
  CLERK_SECRET_KEY="sk_test_7Wb9VikhkBTuO4O6YUjVVCmxQB5wtAvX8V79kubHMi"
  echo "✅ Установлено значение по умолчанию."
else
  echo "✅ CLERK_SECRET_KEY установлен."
fi

if [ -z "$MONGODB_URI" ]; then
  echo "⚠️ ВНИМАНИЕ: MONGODB_URI не установлен!"
  MONGODB_URI="mongodb+srv://shoodyakoff:Eta15DTZ0lORouTf@clusterpmgame.kyw9b.mongodb.net/game-portal?retryWrites=true&w=majority&appName=ClusterPmGame"
  echo "✅ Установлено значение по умолчанию."
else
  echo "✅ MONGODB_URI установлен."
fi

echo "📝 Создание docker-compose.override.yml с переменными окружения..."
cat > docker-compose.override.yml << EOL
version: '3.8'

services:
  nextjs-app:
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
      - MONGODB_URI=${MONGODB_URI}
      - NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
      - NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
      - NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
      - NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select
      - NEXT_PUBLIC_CLERK_MOCK_MODE=false
      - NEXT_PUBLIC_CLERK_NO_VERIFICATION=true
EOL

# Создаем .env файл с правильными переменными окружения
echo "📝 Создание .env файла с переданными переменными окружения..."
cat > .env << EOL
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
MONGODB_URI=${MONGODB_URI}
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select
NEXT_PUBLIC_CLERK_MOCK_MODE=false
NEXT_PUBLIC_CLERK_NO_VERIFICATION=true
EOL

if [ "$REBUILD" = "true" ]; then
  echo "🛑 Остановка существующих контейнеров..."
  docker-compose -f docker-compose.prod.yml down --remove-orphans || true

  echo "🧹 Очистка Docker..."
  docker system prune -f --volumes

  echo "🏗️ Сборка и запуск контейнеров..."
  docker-compose -f docker-compose.prod.yml up -d --build
else
  echo "🚀 Запуск контейнеров без пересборки..."
  docker-compose -f docker-compose.prod.yml up -d
fi

echo "⏳ Ожидание запуска контейнеров..."
sleep 5

echo "📊 Проверка статуса контейнеров..."
docker-compose -f docker-compose.prod.yml ps

echo "📋 Проверка логов контейнера..."
docker-compose -f docker-compose.prod.yml logs --tail=20 nextjs-app

echo "🔍 Проверка работоспособности API..."
curl -v http://localhost:3000/api/healthcheck || echo "❌ API недоступен!"

echo "✅ Настройка завершена!"
echo "🌐 Приложение доступно по адресу: http://176.124.219.223:3000"
echo "📋 Для просмотра логов используйте: docker-compose -f docker-compose.prod.yml logs -f nextjs-app" 