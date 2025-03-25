# Этап 1: Установка зависимостей и сборка приложения
FROM node:18-alpine AS base

# Добавляем обновления безопасности
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init

# Установка зависимостей только при первой сборке
FROM base AS deps
WORKDIR /app

# Копирование package.json и установка зависимостей
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps && \
    npm prune --production && \
    npm cache clean --force

# Сборка приложения
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Проверяем и очищаем env файлы от чувствительных данных
RUN if [ -f .env.production ]; then echo "Using existing .env.production"; else touch .env.production; fi
RUN if [ -f .env.local ]; then echo "Removing .env.local"; rm .env.local; fi
RUN if [ -f .env.sync ]; then echo "Removing .env.sync"; rm .env.sync; fi

# Создание оптимизированной сборки
RUN npm run build && \
    npm prune --production

# Сканирование уязвимостей (опционально, закомментировано для ускорения сборки)
# RUN npm audit --production

# Этап 2: Запуск приложения
FROM base AS runner
WORKDIR /app

# Создаем непривилегированного пользователя
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Установка для продакшен
ENV NODE_ENV=production

# Установка прав доступа на директории
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Настройка безопасности: не запускать как root
USER nextjs

# Expose порт для доступа к приложению
EXPOSE 3000

# Используем dumb-init для правильной обработки сигналов
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Команда запуска приложения
CMD ["node", "server.js"] 