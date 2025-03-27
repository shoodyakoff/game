# Базовый образ
FROM node:18-alpine AS base

# Зависимости
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Устанавливаем только production зависимости
RUN npm ci --only=production
# Отдельно устанавливаем dev зависимости для сборки
RUN npm ci --only=development

# Сборка
FROM base AS builder
WORKDIR /app
# Копируем исходники
COPY . .
# Копируем зависимости
COPY --from=deps /app/node_modules ./node_modules

# Аргументы для сборки
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_API_URL
ARG NODE_ENV=production

# Установка переменных для сборки из аргументов
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NODE_ENV=${NODE_ENV}

# Создание оптимизированной сборки
RUN npm run build && \
    rm -rf node_modules && \
    npm ci --only=production && \
    npm cache clean --force && \
    rm -rf .next/cache

# Финальный образ
FROM base AS runner
WORKDIR /app

# Создание пользователя
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Копируем только необходимые файлы
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"] 