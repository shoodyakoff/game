# Базовый образ для сборки
FROM node:18.19.1-alpine AS builder

# Аргументы сборки для переменных окружения
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG MONGODB_URI

# Рабочая директория
WORKDIR /app

# Добавляем инструменты для диагностики
RUN apk add --no-cache libc6-compat

# Копирование только package.json для кэширования зависимостей
COPY package.json package-lock.json ./
RUN npm ci

# Копирование исходного кода
COPY . .

# Установка переменных для сборки
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_DISABLE_ESLINT=1
ENV ESLINT_SKIP_PRETTIER=1
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY
ENV MONGODB_URI=$MONGODB_URI
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select
ENV NEXT_PUBLIC_CLERK_MOCK_MODE=false
ENV NEXT_PUBLIC_CLERK_NO_VERIFICATION=true

# Вывод диагностической информации
RUN echo "Сборка с переменными:" && \
    echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:0:8}..." && \
    echo "NEXT_PUBLIC_CLERK_MOCK_MODE: $NEXT_PUBLIC_CLERK_MOCK_MODE"

# Сборка проекта
RUN npm run build

# Установка дополнительных инструментов для пост-обработки
RUN apk add --no-cache bash sed

# Копирование и выполнение скрипта патча
COPY fix-clerk-edge.sh /app/fix-clerk-edge.sh
RUN chmod +x /app/fix-clerk-edge.sh

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
COPY --from=builder /app/fix-clerk-edge.sh ./fix-clerk-edge.sh

# Установка рабочих переменных окружения
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Создаем скрипт для запуска с предварительным патчем
RUN echo '#!/bin/bash\necho "🚀 Запуск патча для Clerk..."\nbash ./fix-clerk-edge.sh\necho "🚀 Запуск приложения..."\nnode server.js' > start.sh && \
    chmod +x start.sh

# Экспортируем порт
EXPOSE 3000

# Запускаем приложение через скрипт start.sh
CMD ["./start.sh"] 