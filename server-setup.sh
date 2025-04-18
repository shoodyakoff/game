#!/bin/bash
# Скрипт для настройки и запуска приложения на сервере в мок-режиме

set -e  # Останавливаем скрипт при ошибках

echo "🚀 Начинаем настройку сервера в режиме с имитацией аутентификации..."

# Шаг 1: Обновляем код из репозитория
echo "📥 Обновляем код из репозитория..."
git fetch
git pull origin main

# Шаг 2: Делаем скрипты исполняемыми
echo "🔐 Делаем скрипты исполняемыми..."
chmod +x patch-clerk-modules.sh
chmod +x setup-mock-server.sh

# Шаг 3: Останавливаем существующие контейнеры
echo "🛑 Останавливаем существующие контейнеры..."
docker-compose -f docker-compose.prod.yml down

# Шаг 4: Очищаем Docker
echo "🧹 Очищаем Docker..."
docker system prune -af

# Шаг 5: Патчим модули Clerk
echo "🩹 Патчим проблемные модули Clerk..."
npm ci

# Создаем директорию для модулей Clerk, если она не существует
mkdir -p ./node_modules/@clerk/shared/dist

# Патчим keys.js для обхода проблемы с atob
echo "export function isomorphicAtob(str) { return 'patched'; }
export function isPublishableKey() { return true; }
export function parsePublishableKey() { return { frontendApi: 'clerk.example.com', instanceType: 'test' }; }" > ./node_modules/@clerk/shared/dist/keys.js

echo "✅ Модули Clerk успешно пропатчены!"

# Шаг 6: Создаем файл .env.local с правильными настройками
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

# Шаг 7: Создаем docker-compose.override.yml с необходимыми переменными среды
echo "🐳 Создаем docker-compose.override.yml..."
cat > docker-compose.override.yml << EOL
version: '3'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.minimal
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_JA==
      - CLERK_SECRET_KEY=sk_test_valid_key
      - NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
      - NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
      - NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
      - NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select
      - NEXT_PUBLIC_CLERK_MOCK_MODE=true
      - NEXT_PUBLIC_CLERK_NO_VERIFICATION=true
    volumes:
      - ./.env.local:/app/.env.local
EOL
echo "✅ Файл docker-compose.override.yml создан!"

# Шаг 8: Строим и запускаем контейнеры
echo "🚀 Строим и запускаем контейнеры..."
docker-compose -f docker-compose.prod.yml up -d --build

# Шаг 9: Проверяем статус
echo "🔍 Проверяем статус контейнеров..."
docker-compose -f docker-compose.prod.yml ps

echo "🎉 Установка завершена! 
Приложение доступно по адресу http://localhost:3000

Для просмотра логов используйте команду:
docker-compose -f docker-compose.prod.yml logs -f app"

echo "=== Настройка завершена! ==="
echo "Приложение доступно по адресу: http://<IP-сервера>:3000"
echo "Для просмотра логов используйте: docker-compose -f docker-compose.prod.yml logs -f"
echo "Для запуска логов сейчас введите 'y' (или любую другую клавишу для выхода):"
read answer
if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
  docker-compose -f docker-compose.prod.yml logs -f
fi 