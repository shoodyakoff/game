# Базовый образ
FROM node:18.19.1-alpine

# Рабочая директория
WORKDIR /app

# Установка необходимых пакетов
RUN apk add --no-cache libc6-compat

# Копирование зависимостей
COPY package.json package-lock.json ./
RUN npm ci

# Копирование остальных файлов
COPY . .

# Сборка проекта
ENV NODE_ENV=production
ENV NEXT_PUBLIC_CLERK_MOCK_MODE=false
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dHJ1ZS1nb2xkZmlzaC04MS5jbGVyay5hY2NvdW50cy5kZXYk
ENV CLERK_SECRET_KEY=sk_test_7Wb9VikhkBTuO4O6YUjVVCmxQB5wtAvX8V79kubHMi
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select
ENV NEXT_PUBLIC_CLERK_NO_VERIFICATION=true

# Сборка без линтера
ENV NEXT_DISABLE_ESLINT=1
ENV ESLINT_SKIP_PRETTIER=1
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build --no-lint || next build --no-lint

# Устанавливаем next глобально, чтобы команда была доступна
RUN npm install -g next

# Проверяем наличие .next и node_modules
RUN ls -la && ls -la .next || echo ".next не найден"

# Экспортируем порт
EXPOSE 3000

# Запуск
CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"] 