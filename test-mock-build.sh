#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Запускаем тестовую сборку приложения в mock-режиме...${NC}"

# Устанавливаем переменные окружения для mock-режима
export NEXT_PUBLIC_CLERK_MOCK_MODE=true
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=mock_key

# Запускаем сборку Next.js (с опцией --no-lint для ускорения)
echo -e "${BLUE}🔨 Сборка Next.js приложения в mock-режиме...${NC}"
npm run build -- --no-lint

# Проверяем успешность сборки
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Сборка завершилась с ошибками${NC}"
  echo -e "${BLUE}ℹ️ Нужно обернуть больше страниц в HOC withMockMode${NC}"
  exit 1
else
  echo -e "${GREEN}✅ Сборка успешно завершена!${NC}"
  echo -e "${GREEN}ℹ️ Подход работает, можно применять к остальным страницам${NC}"
fi 