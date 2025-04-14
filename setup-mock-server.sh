#!/bin/bash
# Скрипт для установки и запуска приложения в мок-режиме на сервере

set -e  # Останавливаем скрипт при ошибках

echo "=== Настройка приложения GOTOGROW в мок-режиме ==="

# Обновляем репозиторий
echo "1. Обновление кода из репозитория..."
git pull origin main

# Создаем резервную копию файлов
echo "2. Создание резервных копий файлов конфигурации..."
mkdir -p backup
cp -f docker-compose.prod.yml backup/docker-compose.prod.yml.bak 2>/dev/null || true
cp -f Dockerfile.mock backup/Dockerfile.mock.bak 2>/dev/null || true

# Копируем .env.mock в .env.local, если он существует
if [ -f .env.mock ]; then
  echo "3. Копирование .env.mock в .env.local..."
  cp .env.mock .env.local
fi

# Пересоздаем контейнеры
echo "4. Остановка существующих контейнеров..."
docker-compose -f docker-compose.prod.yml down || true

# Очистка кеша Docker (необязательно, можно закомментировать)
echo "5. Очистка кеша Docker..."
docker system prune -f

# Проверяем, что скрипт патчинга существует
echo "6. Проверка наличия скриптов патчинга..."
if [ ! -f scripts/prepare-mock-build.js ]; then
  echo "ОШИБКА: Скрипт патчинга не найден в scripts/prepare-mock-build.js"
  exit 1
fi

# Сборка и запуск
echo "7. Сборка и запуск контейнеров в мок-режиме..."
docker-compose -f docker-compose.prod.yml up -d --build

# Проверка статуса
echo "8. Проверка статуса контейнеров..."
docker ps

echo "9. Запуск логов (для выхода нажмите Ctrl+C)..."
docker-compose -f docker-compose.prod.yml logs -f

echo "=== Установка завершена! ==="
echo "Приложение доступно по адресу: http://<IP-сервера>:3000"
echo "Для просмотра логов используйте: docker-compose -f docker-compose.prod.yml logs -f" 