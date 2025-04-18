# Базовый образ
FROM node:18.19.1-alpine

# Определение аргументов сборки
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG MONGODB_URI

# Рабочая директория
WORKDIR /app

# Установка необходимых пакетов
RUN apk add --no-cache libc6-compat

# Копирование зависимостей
COPY package.json package-lock.json ./
RUN npm ci

# Копирование остальных файлов
COPY . .

# Сборка проекта
ENV NODE_ENV=production
ENV NEXT_PUBLIC_CLERK_MOCK_MODE=false
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
ENV CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
ENV MONGODB_URI=${MONGODB_URI}
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select
ENV NEXT_PUBLIC_CLERK_NO_VERIFICATION=true

# Сборка без линтера
ENV NEXT_DISABLE_ESLINT=1
ENV ESLINT_SKIP_PRETTIER=1
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build --no-lint || next build --no-lint

# Устанавливаем next глобально, чтобы команда была доступна
RUN npm install -g next

# Подготовка статических файлов для standalone режима
RUN mkdir -p /app/.next/standalone/.next/static
RUN cp -R /app/.next/static /app/.next/standalone/.next/
RUN cp -R /app/public /app/.next/standalone/

# Проверяем наличие .next и node_modules
RUN ls -la && ls -la .next || echo ".next не найден"

# Экспортируем порт
EXPOSE 3000

# Установка переменной окружения для порта
ENV PORT=3000

# Переходим в директорию standalone для запуска
WORKDIR /app/.next/standalone

# Запуск standalone сервера для продакшена
CMD ["node", "server.js"] 