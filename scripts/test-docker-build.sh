#!/bin/bash
# Скрипт для тестирования Docker-сборки локально

echo "🔄 Начинаю тестирование Docker-сборки..."

# Сохраняем оригинальные переменные окружения
ORIGINAL_CLERK_PK=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ORIGINAL_CLERK_SK=$CLERK_SECRET_KEY
ORIGINAL_CLERK_SIGN_IN=$NEXT_PUBLIC_CLERK_SIGN_IN_URL
ORIGINAL_CLERK_SIGN_UP=$NEXT_PUBLIC_CLERK_SIGN_UP_URL
ORIGINAL_CLERK_AFTER_SIGN_IN=$NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
ORIGINAL_CLERK_AFTER_SIGN_UP=$NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL

# Очищаем переменные окружения
unset NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
unset CLERK_SECRET_KEY
unset NEXT_PUBLIC_CLERK_SIGN_IN_URL
unset NEXT_PUBLIC_CLERK_SIGN_UP_URL
unset NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
unset NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL

# Устанавливаем фиктивные значения для имитации Docker-среды
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_valid_looking_clerk_key_for_build_12345
export CLERK_SECRET_KEY=sk_test_valid_looking_clerk_secret_key_for_build_67890
export NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
export NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
export NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
export NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select

echo "✅ Установлены тестовые переменные окружения"
echo "🏗️ Запускаю Docker-сборку..."

# Запускаем сборку с увеличенной памятью, как в Docker
NODE_OPTIONS="--max-old-space-size=4096" npm run build:docker

# Сохраняем результат сборки
BUILD_RESULT=$?

echo "🧹 Восстанавливаю оригинальные переменные окружения..."

# Восстанавливаем оригинальные переменные окружения
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$ORIGINAL_CLERK_PK
export CLERK_SECRET_KEY=$ORIGINAL_CLERK_SK
export NEXT_PUBLIC_CLERK_SIGN_IN_URL=$ORIGINAL_CLERK_SIGN_IN
export NEXT_PUBLIC_CLERK_SIGN_UP_URL=$ORIGINAL_CLERK_SIGN_UP
export NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=$ORIGINAL_CLERK_AFTER_SIGN_IN
export NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=$ORIGINAL_CLERK_AFTER_SIGN_UP

if [ $BUILD_RESULT -eq 0 ]; then
  echo "✅ Docker-сборка успешно завершена!"
else
  echo "❌ Docker-сборка завершилась с ошибкой (код: $BUILD_RESULT)"
fi

exit $BUILD_RESULT 