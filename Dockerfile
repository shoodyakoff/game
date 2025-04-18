# Базовый образ для сборки
FROM node:18.19.1-alpine AS deps

# Рабочая директория
WORKDIR /app

# Добавляем только зависимости для кэширования
RUN apk add --no-cache libc6-compat

# Копирование только package.json для кэширования зависимостей
COPY package.json package-lock.json ./
RUN npm ci

# Базовый образ для сборки
FROM node:18.19.1-alpine AS builder

# Рабочая директория
WORKDIR /app

# Копирование зависимостей из предыдущего этапа
COPY --from=deps /app/node_modules ./node_modules

# Копирование только необходимых файлов исходного кода
COPY src/ ./src/
COPY public/ ./public/
COPY next.config.js package.json package-lock.json ./

# Установка переменных для сборки
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    NEXT_DISABLE_ESLINT=1 \
    ESLINT_SKIP_PRETTIER=1

# Сборка проекта
RUN npm run build

# Второй этап: минимальный контейнер для запуска приложения
FROM node:18.19.1-alpine AS runner

# Установка необходимых инструментов для работы с патчем
RUN apk add --no-cache bash sed

WORKDIR /app

# Копируем только необходимые файлы
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY fix-clerk-edge.sh ./

# Установка рабочих переменных окружения
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Делаем скрипт исполняемым
RUN chmod +x fix-clerk-edge.sh

# Создаем скрипт для запуска с предварительным патчем
RUN echo '#!/bin/bash\necho "🚀 Запуск патча для Clerk..."\n./fix-clerk-edge.sh || echo "Предупреждение: Патч не применён, но продолжаем работу"\necho "🚀 Запуск приложения..."\nnode server.js' > start.sh && \
    chmod +x start.sh

# Экспортируем порт
EXPOSE 3000

# Запускаем приложение через скрипт start.sh
CMD ["./start.sh"] 