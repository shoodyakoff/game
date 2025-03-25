# Этап 1: Установка зависимостей и сборка приложения
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Копируем .env.production если существует или создаем пустой файл
RUN if [ -f .env.production ]; then echo "Using existing .env.production"; else touch .env.production; fi

# Сборка приложения
RUN npm run build

# Этап 2: Запуск приложения
FROM node:18-alpine AS runner

WORKDIR /app

# Устанавливаем только production зависимости
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Копируем сборку и статические файлы
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
# Не копируем .env.production, так как он будет примонтирован как том

# Expose порт для доступа к приложению
EXPOSE 3000

# Команда запуска приложения
CMD ["npm", "start"] 