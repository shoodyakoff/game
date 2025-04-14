#!/bin/bash

# Проверяем наличие Node.js и Docker
if ! command -v node &> /dev/null; then
  echo "❌ Node.js не найден. Пожалуйста, установите Node.js"
  exit 1
fi

if ! command -v docker &> /dev/null; then
  echo "❌ Docker не найден. Пожалуйста, установите Docker"
  exit 1
fi

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Начинаем сборку приложения в mock-режиме...${NC}"

# Создаем временный .env.local файл для mock-режима
echo -e "${BLUE}📝 Создаем временный .env файл для mock-режима...${NC}"
cat > .env.mock <<EOL
# Конфигурация для mock-режима
NEXT_PUBLIC_CLERK_MOCK_MODE=true
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=mock_key
NODE_ENV=production
EOL

# Устанавливаем зависимости, если node_modules отсутствует
if [ ! -d "node_modules" ]; then
  echo -e "${BLUE}📦 Устанавливаем зависимости...${NC}"
  npm ci
fi

# Выполняем сборку Next.js приложения в mock-режиме
echo -e "${BLUE}🔨 Сборка Next.js приложения в mock-режиме...${NC}"
NEXT_PUBLIC_CLERK_MOCK_MODE=true NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=mock_key npm run build

# Проверяем успешность сборки
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Ошибка при сборке приложения.${NC}"
  rm -f .env.mock
  exit 1
fi

# Собираем Docker-образ
echo -e "${BLUE}🐳 Сборка Docker-образа...${NC}"
docker build -f Dockerfile.simple -t gotogrow:mock .

# Проверяем успешность сборки Docker
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Ошибка при сборке Docker-образа.${NC}"
  rm -f .env.mock
  exit 1
fi

# Удаляем временный .env файл
rm -f .env.mock

echo -e "${GREEN}✅ Сборка успешно завершена!${NC}"
echo -e "${GREEN}🚀 Запустите Docker-образ: docker run -p 3000:3000 gotogrow:mock${NC}" 