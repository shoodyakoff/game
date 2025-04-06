# Базовый образ
FROM node:18.19.1-alpine AS base

# Установка базовых зависимостей
RUN apk add --no-cache libc6-compat curl

# Этап установки зависимостей
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci && \
    npm cache clean --force

# Этап сборки
FROM base AS builder
WORKDIR /app

# Публичные переменные окружения для сборки
ARG NEXT_PUBLIC_APP_NAME=GOTOGROW
ARG NEXT_PUBLIC_APP_VERSION=1.0.0
ARG NEXT_PUBLIC_API_URL
ARG NODE_ENV=production

# Установка переменных окружения для сборки
ENV NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME}
ENV NEXT_PUBLIC_APP_VERSION=${NEXT_PUBLIC_APP_VERSION}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:3000}
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_MONGODB_CHECK=true

# Копирование зависимостей и исходного кода
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Создание временного .env файла для сборки
RUN echo "NEXTAUTH_SECRET=dummy-build-secret\nJWT_SECRET=dummy-build-jwt\nMONGODB_URI=mongodb://localhost:27017/dummy-db" > .env.build

# Сборка приложения
RUN npm run build

# Очистка и установка только production зависимостей
RUN rm -rf node_modules && \
    npm ci --only=production && \
    npm cache clean --force && \
    rm -rf .next/cache && \
    rm -rf .git && \
    rm -rf .github && \
    rm -rf test && \
    rm -rf tests && \
    rm -rf __tests__ && \
    rm -rf coverage && \
    rm -f .env.build

# Финальный этап
FROM base AS runner
WORKDIR /app

# Установка необходимых утилит
RUN apk add --no-cache curl netcat-openbsd

# Создание непривилегированного пользователя
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Создание необходимых директорий и установка прав
RUN mkdir -p .next && \
    chown -R nextjs:nodejs .

# Базовые переменные окружения
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV SKIP_MONGODB_CHECK=true

# Копирование файлов из builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js

# Создание скрипта проверки здоровья
USER root
RUN echo '#!/bin/sh\n\
# Базовая проверка на запуск процесса\n\
if pgrep -x "node" > /dev/null; then\n\
    # Процесс Node работает, возвращаем успешный статус\n\
    echo "Node process is running"\n\
    exit 0\n\
else\n\
    echo "Node process is not running"\n\
    exit 1\n\
fi\n\
' > /usr/local/bin/healthcheck.sh && chmod +x /usr/local/bin/healthcheck.sh && \
  ls -la /usr/local/bin/healthcheck.sh

# Переключение на непривилегированного пользователя
USER nextjs

# Открытие порта
EXPOSE 3000

# Запуск приложения
CMD ["npm", "start"]

# Проверка здоровья с мягкими параметрами
HEALTHCHECK --interval=60s --timeout=30s --start-period=60s --retries=5 \
    CMD /usr/local/bin/healthcheck.sh

# Метка приложения
LABEL app_id={app_id} 