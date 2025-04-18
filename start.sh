#!/bin/bash
echo "=== Запуск сервера Next.js ===="
echo "Node $(node -v), NPM $(npm -v)"
echo "Директория: $(pwd)"

# Настройка переменных окружения
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:-pk_test_dHJ1ZS1nb2xkZmlzaC04MS5jbGVyay5hY2NvdW50cy5kZXYk}
export CLERK_SECRET_KEY=${CLERK_SECRET_KEY:-sk_test_7Wb9VikhkBTuO4O6YUjVVCmxQB5wtAvX8V79kubHMi}
export NODE_ENV=${NODE_ENV:-development}
export NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
export NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
export NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
export NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select
export NEXT_PUBLIC_CLERK_MOCK_MODE=${NEXT_PUBLIC_CLERK_MOCK_MODE:-false}
export NEXT_PUBLIC_CLERK_NO_VERIFICATION=${NEXT_PUBLIC_CLERK_NO_VERIFICATION:-true}

echo "=== Переменные окружения ===="
echo "NODE_ENV: $NODE_ENV"
echo "NEXT_PUBLIC_CLERK_MOCK_MODE: $NEXT_PUBLIC_CLERK_MOCK_MODE"

echo "=== Запуск приложения ===="
# Запускаем Next.js напрямую вместо server.js
npx next dev -p 3000 -H 0.0.0.0 