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

# Копирование файлов из builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js

# Создание скрипта проверки здоровья
RUN echo '#!/bin/sh\n\
# Проверка процесса Node\n\
if ! pgrep -x "node" > /dev/null; then\n\
    echo "Node process is not running"\n\
    exit 1\n\
fi\n\
\n\
# Проверка MongoDB с задержкой\n\
if [ -n "$MONGODB_URI" ]; then\n\
    echo "Waiting for MongoDB to be ready..."\n\
    sleep 5\n\
    echo "Checking MongoDB connection..."\n\
    if ! nc -z $(echo $MONGODB_URI | sed -n "s/.*@\\([^/]*\\).*/\1/p") 27017; then\n\
        echo "MongoDB is not accessible"\n\
        exit 1\n\
    fi\n\
    echo "MongoDB connection successful"\n\
fi\n\
\n\
# Проверка API с повторными попытками\n\
echo "Checking API health..."\n\
for i in 1 2 3; do\n\
    if curl -f http://localhost:3000/api/healthcheck; then\n\
        echo "API is responding"\n\
        exit 0\n\
    fi\n\
    echo "Attempt $i failed, waiting before retry..."\n\
    sleep 2\n\
done\n\
\n\
echo "API is not responding after multiple attempts"\n\
exit 1\n\
' > /usr/local/bin/healthcheck.sh && chmod +x /usr/local/bin/healthcheck.sh

# Переключение на непривилегированного пользователя
USER nextjs

# Открытие порта
EXPOSE 3000

# Запуск приложения
CMD ["npm", "start"]

# Проверка здоровья
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD /usr/local/bin/healthcheck.sh

# Метка приложения
LABEL app_id={app_id} 