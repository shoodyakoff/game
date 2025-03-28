# Указываем конкретную версию Node.js
FROM node:18.19.1-alpine AS base

# Устанавливаем зависимости
FROM base AS deps
WORKDIR /app

# Устанавливаем дополнительные зависимости для сборки
RUN apk add --no-cache libc6-compat

# Копируем только файлы для установки зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci && \
    npm cache clean --force

# Сборка
FROM base AS builder
WORKDIR /app

# Сначала устанавливаем переменные окружения
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_API_URL
ARG NODE_ENV=production

ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=1

# Копируем зависимости
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Проверка содержимого next.config.js перед сборкой
RUN cat next.config.js

# Создание оптимизированной сборки
RUN npm run build

# Проверка создания директории standalone
RUN ls -la ./.next/ || true

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

# Копируем необходимые файлы 
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Проверяем наличие директории standalone перед копированием
# Если директории standalone нет, копируем всю директорию .next
RUN mkdir -p ./.next/static

# Копирование всей директории .next вместо только standalone
# Это решение для случаев, когда standalone режим не применяется
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Переключаемся на непривилегированного пользователя
USER nextjs

EXPOSE 3000

# Проверка работоспособности
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://localhost:3000/api/health || exit 1

# Запускаем Next.js в production режиме
CMD ["npm", "start"] 