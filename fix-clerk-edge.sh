#!/bin/bash

# Скрипт для исправления проблемы с Clerk и Edge Runtime

set -e

echo "🔧 Создание патчей для Clerk в Node.js runtime..."

# Получаем путь к node_modules
NODE_MODULES_PATH=node_modules
if [ ! -d "$NODE_MODULES_PATH" ]; then
  # Проверяем существование .next/standalone/node_modules
  if [ -d ".next/standalone/node_modules" ]; then
    NODE_MODULES_PATH=".next/standalone/node_modules"
  else 
    echo "❌ Не найдена папка node_modules!"
    exit 1
  fi
fi

# Патчим middleware.js для замены требований scheduler
echo "🧩 Исправление middleware.js..."
MIDDLEWARE_PATH=".next/standalone/.next/server/src/middleware.js"

if [ -f "$MIDDLEWARE_PATH" ]; then
  # Создаем бэкап
  cp "$MIDDLEWARE_PATH" "${MIDDLEWARE_PATH}.bak"
  
  # Заменяем импорт scheduler на пустую функцию
  sed -i 's/e.exports=scheduler/e.exports={}/' "$MIDDLEWARE_PATH"
  
  echo "✅ middleware.js успешно пропатчен!"
else
  echo "❌ Не найден файл middleware.js!"
  exit 1
fi

# Создаем простой полифилл для scheduler
echo "📝 Создание полифилла для scheduler..."
POLYFILL_DIR=".next/standalone/.next/server/chunks"
mkdir -p "$POLYFILL_DIR"

cat > "$POLYFILL_DIR/scheduler-polyfill.js" << 'EOL'
// Простой полифилл для scheduler
// Это решает проблему с Edge Runtime
const scheduler = {};
module.exports = scheduler;
EOL

echo "✅ Патч для Clerk успешно установлен!"
echo "🚀 Приложение должно теперь запуститься без ошибок middleware." 