# Базовый образ
FROM node:18.19.1-alpine

# Установка зависимостей
RUN apk add --no-cache libc6-compat curl bash

# Рабочая директория
WORKDIR /app

# Копирование файлов проекта
COPY package.json package-lock.json ./
RUN npm ci

# Копирование исходного кода
COPY . .

# Создаем server.js для запуска Next.js
RUN echo 'const { createServer } = require("http");' > /app/server.js && \
    echo 'const { parse } = require("url");' >> /app/server.js && \
    echo 'const next = require("next");' >> /app/server.js && \
    echo 'const dev = process.env.NODE_ENV !== "production";' >> /app/server.js && \
    echo 'const hostname = "0.0.0.0";' >> /app/server.js && \
    echo 'const port = 3000;' >> /app/server.js && \
    echo 'console.log(`Запуск Next.js в ${dev ? "dev" : "production"} режиме`);' >> /app/server.js && \
    echo 'const app = next({ dev, hostname, port });' >> /app/server.js && \
    echo 'const handle = app.getRequestHandler();' >> /app/server.js && \
    echo 'console.log("Подготовка приложения...");' >> /app/server.js && \
    echo 'app.prepare().then(() => {' >> /app/server.js && \
    echo '  console.log("Приложение готово, запускаем сервер...");' >> /app/server.js && \
    echo '  createServer((req, res) => {' >> /app/server.js && \
    echo '    try {' >> /app/server.js && \
    echo '      handle(req, res, parse(req.url, true));' >> /app/server.js && \
    echo '    } catch (err) {' >> /app/server.js && \
    echo '      console.error("Ошибка при обработке запроса:", err);' >> /app/server.js && \
    echo '      res.statusCode = 500;' >> /app/server.js && \
    echo '      res.end("Внутренняя ошибка сервера");' >> /app/server.js && \
    echo '    }' >> /app/server.js && \
    echo '  }).listen(port, hostname, (err) => {' >> /app/server.js && \
    echo '    if (err) throw err;' >> /app/server.js && \
    echo '    console.log(`Сервер Next.js запущен на http://${hostname}:${port}`);' >> /app/server.js && \
    echo '  });' >> /app/server.js && \
    echo '}).catch(err => {' >> /app/server.js && \
    echo '  console.error("Ошибка при подготовке приложения:", err);' >> /app/server.js && \
    echo '  process.exit(1);' >> /app/server.js && \
    echo '});' >> /app/server.js

# Создаем запускной скрипт
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'echo "=== Запуск сервера Next.js ===="' >> /app/start.sh && \
    echo 'echo "Node $(node -v), NPM $(npm -v)"' >> /app/start.sh && \
    echo 'echo "Директория: $(pwd)"' >> /app/start.sh && \
    echo 'export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:-pk_test_dHJ1ZS1nb2xkZmlzaC04MS5jbGVyay5hY2NvdW50cy5kZXYk}' >> /app/start.sh && \
    echo 'export CLERK_SECRET_KEY=${CLERK_SECRET_KEY:-sk_test_7Wb9VikhkBTuO4O6YUjVVCmxQB5wtAvX8V79kubHMi}' >> /app/start.sh && \
    echo 'export NODE_ENV=${NODE_ENV:-development}' >> /app/start.sh && \
    echo 'export NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in' >> /app/start.sh && \
    echo 'export NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up' >> /app/start.sh && \
    echo 'export NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard' >> /app/start.sh && \
    echo 'export NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select' >> /app/start.sh && \
    echo 'export NEXT_PUBLIC_CLERK_MOCK_MODE=${NEXT_PUBLIC_CLERK_MOCK_MODE:-false}' >> /app/start.sh && \
    echo 'export NEXT_PUBLIC_CLERK_NO_VERIFICATION=${NEXT_PUBLIC_CLERK_NO_VERIFICATION:-true}' >> /app/start.sh && \
    echo 'echo "=== Переменные окружения ===="' >> /app/start.sh && \
    echo 'echo "NODE_ENV: $NODE_ENV"' >> /app/start.sh && \
    echo 'echo "NEXT_PUBLIC_CLERK_MOCK_MODE: $NEXT_PUBLIC_CLERK_MOCK_MODE"' >> /app/start.sh && \
    echo 'echo "=== Запуск приложения ===="' >> /app/start.sh && \
    echo 'node server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Экспортируем порт
EXPOSE 3000

# Запускаем приложение
CMD ["/app/start.sh"] 