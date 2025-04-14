#!/bin/bash
# Скрипт для настройки и запуска приложения на сервере в мок-режиме

set -e  # Останавливаем скрипт при ошибках

echo "=== Настройка приложения GOTOGROW на сервере в мок-режиме ==="

# Обновляем репозиторий
echo "1. Обновление кода из репозитория..."
git pull origin main

# Делаем скрипты исполняемыми
echo "2. Настройка прав доступа для скриптов..."
chmod +x patch-clerk-modules.sh
chmod +x setup-mock-server.sh

# Пересоздаем контейнеры
echo "3. Остановка существующих контейнеров..."
docker-compose -f docker-compose.prod.yml down || true

# Очистка Docker
echo "4. Очистка Docker..."
docker system prune -f

# Патчим модули Clerk перед сборкой
echo "5. Патчинг модулей Clerk..."
./patch-clerk-modules.sh

# Создаем файл docker-compose.override.yml с нужными настройками
echo "6. Создание docker-compose.override.yml..."
cat > docker-compose.override.yml << 'EOF'
version: '3.8'

services:
  nextjs-app:
    build:
      args:
        - NEXT_PUBLIC_CLERK_MOCK_MODE=true
        - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=mock_key_not_for_validation
        - CLERK_SECRET_KEY=mock_secret_key_not_used
    environment:
      - NEXT_PUBLIC_CLERK_MOCK_MODE=true
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=mock_key_not_for_validation
      - NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
      - NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
      - NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
      - NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select
      - NEXT_PUBLIC_CLERK_NO_VERIFICATION=true
EOF

# Сборка и запуск
echo "7. Сборка и запуск контейнеров..."
docker-compose -f docker-compose.prod.yml up -d --build

# Проверка статуса
echo "8. Проверка статуса контейнеров..."
docker ps

echo "=== Настройка завершена! ==="
echo "Приложение доступно по адресу: http://<IP-сервера>:3000"
echo "Для просмотра логов используйте: docker-compose -f docker-compose.prod.yml logs -f"
echo "Для запуска логов сейчас введите 'y' (или любую другую клавишу для выхода):"
read answer
if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
  docker-compose -f docker-compose.prod.yml logs -f
fi 