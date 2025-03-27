# Базовый образ
FROM node:18-alpine AS base

# Установка зависимостей
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Сборка
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Аргументы для сборки
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_API_URL
ARG NODE_ENV=production

# Установка переменных для сборки из аргументов
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NODE_ENV=${NODE_ENV}

# Создание оптимизированной сборки
RUN npm run build

# Продакшен образ
FROM base AS runner
WORKDIR /app

# Создание пользователя
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копирование собранного приложения
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Порт для Next.js
ENV PORT=3000

CMD ["node", "server.js"] 