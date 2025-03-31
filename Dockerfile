# Указываем конкретную версию Node.js
FROM node:18.19.1-alpine AS base

# Устанавливаем зависимости
FROM base AS deps
WORKDIR /app

# Устанавливаем дополнительные зависимости для сборки
RUN apk add --no-cache libc6-compat curl

# Копируем только файлы для установки зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci && \
    npm cache clean --force

# Сборка
FROM base AS builder
WORKDIR /app

# Объявляем только публичные переменные окружения
ARG NEXT_PUBLIC_APP_NAME=GOTOGROW
ARG NEXT_PUBLIC_APP_VERSION=1.0.0
ARG NEXT_PUBLIC_API_URL
ARG NODE_ENV=production

# Устанавливаем значения по умолчанию для публичных переменных
ENV NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME}
ENV NEXT_PUBLIC_APP_VERSION=${NEXT_PUBLIC_APP_VERSION}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:3000}
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=1

# Отключаем проверку MongoDB только для сборки
ENV SKIP_MONGODB_CHECK=true

# Копируем зависимости
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Создаем временный файл с фиктивными значениями только для сборки
RUN echo "NEXTAUTH_SECRET=dummy-build-secret\nJWT_SECRET=dummy-build-jwt\nMONGODB_URI=mongodb://localhost:27017/dummy-db" > .env.build

# Создание оптимизированной сборки
RUN npm run build

# Удаление ненужных файлов и оптимизация размера образа
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
    rm -f .env.build # Удаляем временный файл с фиктивными значениями

# Финальный образ
FROM base AS runner
WORKDIR /app

# Устанавливаем curl и netcat для healthcheck
RUN apk add --no-cache curl netcat-openbsd

# Создание пользователя
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Устанавливаем рабочую директорию и права
RUN mkdir -p .next && \
    chown -R nextjs:nodejs .

# Устанавливаем только необходимые переменные окружения
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Копируем необходимые файлы 
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js

# Создаем расширенный скрипт для проверки работоспособности
RUN echo '#!/bin/sh\n\
# Проверяем, что процесс node запущен\n\
if ! pgrep -x "node" > /dev/null; then\n\
    echo "Node process is not running"\n\
    exit 1\n\
fi\n\
\n\
# Проверяем доступность MongoDB\n\
if [ -n "$MONGODB_URI" ]; then\n\
    echo "Checking MongoDB connection..."\n\
    if ! nc -z $(echo $MONGODB_URI | sed -n "s/.*@\\([^/]*\\).*/\1/p") 27017; then\n\
        echo "MongoDB is not accessible"\n\
        exit 1\n\
    fi\n\
fi\n\
\n\
# Проверяем доступность API\n\
if ! curl -f http://localhost:3000/api/healthcheck; then\n\
    echo "API is not responding"\n\
    exit 1\n\
fi\n\
' > /usr/local/bin/healthcheck.sh && \
chmod +x /usr/local/bin/healthcheck.sh

# Переключаемся на непривилегированного пользователя
USER nextjs

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]

# Добавляем healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD /usr/local/bin/healthcheck.sh 