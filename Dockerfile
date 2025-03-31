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

# Объявляем переменные окружения как ARG
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_API_URL
ARG NODE_ENV=production
ARG MONGODB_URI
ARG NEXTAUTH_SECRET

# Используем значения по умолчанию только для сборки, если переменные не переданы
ENV NEXTAUTH_URL=${NEXTAUTH_URL:-http://localhost:3000}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:3000}
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=1
ENV MONGODB_URI=${MONGODB_URI:-mongodb://localhost:27017/game-portal}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-temporarysecretforbuildonlydonotuseinproduction}
# Отключаем проверку MongoDB для сборки
ENV SKIP_MONGODB_CHECK=true

# Копируем зависимости
COPY --from=deps /app/node_modules ./node_modules
COPY . .

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
    rm -rf coverage

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

# Устанавливаем переменные окружения для production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# Отключаем проверку MongoDB чтобы система могла стартовать
ENV SKIP_MONGODB_CHECK=true

# Копируем необходимые файлы 
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js

# Создаем файл для проверки работоспособности приложения
RUN echo '#!/bin/sh\n\
# Простая проверка порта для быстрого успешного healthcheck\n\
if nc -z localhost 3000; then\n\
  echo "Server is listening on port 3000"\n\
  exit 0\n\
else\n\
  echo "Server is not responding on port 3000"\n\
  exit 1\n\
fi' > /app/healthcheck.sh && \
    chmod +x /app/healthcheck.sh && \
    chown nextjs:nodejs /app/healthcheck.sh

# Переключаемся на непривилегированного пользователя
USER nextjs

EXPOSE 3000

# Проверка работоспособности с увеличенным временем ожидания
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
    CMD /app/healthcheck.sh

# Запускаем Next.js в production режиме
CMD ["npm", "start"] 