# Базовый образ для сборки
FROM node:18.19.1-alpine AS base

# Устанавливаем зависимости
RUN apk add --no-cache libc6-compat curl bash sed

WORKDIR /app

# Задаем аргументы сборки
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG MONGODB_URI
ARG NODE_ENV=production

# Копируем файлы зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Устанавливаем переменные окружения для сборки
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
ENV CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
ENV MONGODB_URI=${MONGODB_URI}
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select
ENV NEXT_PUBLIC_CLERK_MOCK_MODE=false
ENV CLERK_NO_VERIFICATION=true

# Принудительно удаляем конфликтующие файлы
RUN rm -f pages/api/health.ts pages/api/healthcheck.ts app/api/health/route.ts app/api/healthcheck/route.ts || true
RUN rm -f src/pages/api/health.ts src/pages/api/healthcheck.ts src/app/api/health/route.ts src/app/api/healthcheck/route.ts || true

# Собираем приложение
RUN npm run build

# Настраиваем standalone режим
RUN cp -R .next/static .next/standalone/.next/ && \
    cp -R public .next/standalone/

# Создаем необходимые скрипты
RUN if [ -f fix-clerk-edge.sh ]; then \
      cp fix-clerk-edge.sh .next/standalone/ && \
      chmod +x .next/standalone/fix-clerk-edge.sh; \
    else \
      echo '#!/bin/bash' > .next/standalone/fix-clerk-edge.sh && \
      chmod +x .next/standalone/fix-clerk-edge.sh; \
    fi

# Создаем скрипт запуска
RUN echo '#!/bin/bash\necho "🚀 Запуск патча для Clerk..."\n./fix-clerk-edge.sh || echo "Предупреждение: Патч не применён, но продолжаем работу"\necho "🚀 Запуск приложения..."\nexec node server.js' > .next/standalone/start.sh && \
    chmod +x .next/standalone/start.sh

# Создаем финальный образ с минимальными зависимостями
FROM node:18.19.1-alpine AS runner

# Устанавливаем зависимости
RUN apk add --no-cache libc6-compat curl bash sed

WORKDIR /app

# Копируем собранное приложение
COPY --from=base /app/.next/standalone/ ./
COPY --from=base /app/.next/static ./.next/static
COPY --from=base /app/public ./public

# Явно копируем скрипты запуска
COPY --from=base /app/.next/standalone/start.sh ./
COPY --from=base /app/.next/standalone/fix-clerk-edge.sh ./

# Проверяем наличие файлов
RUN ls -la && \
    echo "Проверка наличия start.sh:" && \
    find / -name "start.sh" -type f 2>/dev/null && \
    echo "Проверка прав на запуск:" && \
    chmod +x ./start.sh ./fix-clerk-edge.sh && \
    ls -la ./start.sh

# Экспонируем порт
EXPOSE 3000

# Устанавливаем хост и порт
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Создаем скрипт запуска прямо в финальном образе для избежания проблем с форматом
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'echo "🚀 Запуск Next.js приложения в production режиме..."' >> /app/entrypoint.sh && \
    echo 'cd /app' >> /app/entrypoint.sh && \
    echo 'exec node server.js' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh && \
    cat /app/entrypoint.sh

# Запускаем приложение через новый скрипт
CMD ["/app/entrypoint.sh"] 
