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

# Создание оптимизированной сборки
RUN npm run build && \
    rm -rf node_modules && \
    npm ci --only=production && \
    npm cache clean --force && \
    rm -rf .next/cache && \
    rm -rf .git && \
    rm -rf .github && \
    rm -rf .next/cache && \
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
RUN mkdir .next && \
    chown -R nextjs:nodejs .

# Устанавливаем переменные окружения для production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Копируем только необходимые файлы
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Переключаемся на непривилегированного пользователя
USER nextjs

EXPOSE 3000

# Проверка работоспособности
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"] 