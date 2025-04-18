#!/bin/bash

# Скрипт для настройки и запуска приложения на сервере в production режиме

# Получаем внешний IP-адрес сервера
SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

# Останавливаем существующие контейнеры
echo "Останавливаем существующие контейнеры..."
docker compose -f docker-compose.prod.yml down

# Создаем .env файл для docker-compose
echo "Создаем .env файл с переменными окружения..."
cat > .env << EOF2
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dHJ1ZS1nb2xkZmlzaC04MS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_7Wb9VikhkBTuO4O6YUjVVCmxQB5wtAvX8V79kubHMi
MONGODB_URI=mongodb+srv://admin:gototop-pass@cluster0.nlnbpyi.mongodb.net/gotogrow?retryWrites=true&w=majority
EOF2

# Очищаем Docker кэш при необходимости
echo "Очищаем Docker кэш..."
docker system prune -f --volumes

# Строим и запускаем контейнеры
echo "Строим и запускаем контейнеры..."
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d

# Проверяем статус контейнеров
echo "Проверяем статус контейнеров..."
docker compose -f docker-compose.prod.yml ps

echo "Настройка завершена. Приложение будет доступно по адресу http://${SERVER_IP}:3000"
echo "Для просмотра логов используйте команду: docker compose -f docker-compose.prod.yml logs -f nextjs-app"
