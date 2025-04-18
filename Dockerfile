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
ENV NODE_ENV production
ENV NEXT_PUBLIC_CLERK_MOCK_MODE false
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY pk_test_dHJ1ZS1nb2xkZmlzaC04MS5jbGVyay5hY2NvdW50cy5kZXYk
ENV CLERK_SECRET_KEY sk_test_7Wb9VikhkBTuO4O6YUjVVCmxQB5wtAvX8V79kubHMi
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL /sign-in
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL /sign-up
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL /dashboard
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL /character/select
ENV NEXT_PUBLIC_CLERK_NO_VERIFICATION true
RUN npm run build

# Экспортируем порт
EXPOSE 3000

# Запуск
CMD ["npm", "start"] 