# План действий по повышению безопасности

Этот документ содержит план действий для завершения работ по улучшению безопасности Game Portal.

## 1. Действия на Timeweb Cloud

### Настройка переменных окружения
- Зайдите в панель управления Timeweb Cloud
- Найдите ваш проект "shoodyakoff-game-13b1"
- Перейдите в раздел "Переменные окружения" или "Настройки"
- Добавьте или обновите следующие переменные:

```
NEXT_PUBLIC_API_URL=https://shoodyakoff-game-13b1.twc1.net/api
NEXTAUTH_URL=https://shoodyakoff-game-13b1.twc1.net
NEXTAUTH_SECRET=[сгенерируйте сложный ключ]
MONGODB_URI=mongodb+srv://shoodyakoff:Eta15DTZ0lORouTf@clusterpmgame.kyw9b.mongodb.net/game-portal?retryWrites=true&w=majority&appName=ClusterPmGame
JWT_SECRET=[сгенерируйте сложный ключ]
JWT_EXPIRATION=7d
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_NAME=Game Portal
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ALLOWED_ORIGINS=https://shoodyakoff-game-13b1.twc1.net
```

### Очистка кеша и перезапуск
- Перезапустите ваше приложение после изменения переменных окружения
- Очистите кеш на сервере

## 2. Локальная подготовка

### Подготовка зависимостей
```bash
# Обновить зависимости до последних версий
npm update

# Проверить на уязвимости и исправить
npm audit fix
```

### Обновление Git для удаления приватных ключей
```bash
# Удалить SSH-ключи из репозитория
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch s s.pub" --prune-empty --tag-name-filter cat -- --all

# Принудительно обновить репозиторий
git push origin --force --all
```

### Проверка безопасности
```bash
# Запустить скрипт проверки безопасности
./security-check.sh

# Проверить на уязвимости
npm audit
```

## 3. Обновление кодовой базы

### Установка новых зависимостей
```bash
# Установка библиотек безопасности
npm install helmet xss validator zod rate-limiter-flexible --save
```

### Дополнительные файлы для создания
- `/public/favicon.ico` (уже создан)
- `/public/images/hero-pattern.svg` (уже создан)
- `/src/middleware.ts` (уже создан)
- `/src/server/utils/validation.ts` (уже создан)

### Дополнительные обновления
1. Обновить API-роуты для использования валидации
2. Добавить проверку входных данных во все формы
3. Реализовать защиту от CSRF в формах
4. Настроить правильные заголовки CSP

## 4. Деплой изменений

### Подготовка к деплою
```bash
# Сборка проекта
npm run build

# Подготовка файлов для деплоя
mkdir -p deploy
cp -r .next package.json package-lock.json public .env.production deploy/
mv deploy/.env.production deploy/.env
```

### Создание конфигурационного файла PM2
```bash
# Создать файл ecosystem.config.js
cat > deploy/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'game-portal',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
EOF
```

### Деплой на сервер
```bash
# Создание архива
tar -czf deploy.tar.gz -C deploy .

# Загрузка архива на сервер (замените username и hostname)
scp deploy.tar.gz username@hostname:/home/username/your-site/

# Подключение к серверу и разворачивание
ssh username@hostname
cd /home/username/your-site
tar -xzf deploy.tar.gz
rm deploy.tar.gz
npm install --production
npx pm2 restart all
```

## 5. Регулярные задачи по безопасности

### Еженедельно
- Обновление зависимостей: `npm update`
- Проверка на уязвимости: `npm audit`
- Запуск скрипта проверки безопасности: `./security-check.sh`

### Ежемесячно
- Обновление NextJS до последней версии
- Проверка и обновление MongoDB
- Обзор журналов и отчетов безопасности

### Ежеквартально
- Обновление секретных ключей (JWT, NextAuth)
- Полное обновление всех зависимостей
- Тестирование безопасности

## 6. Дополнительные рекомендации

### Резервное копирование
- Настройте автоматическое резервное копирование MongoDB
- Настройте резервное копирование файлов приложения
- Тестируйте восстановление из резервных копий

### Мониторинг
- Настройте журналирование событий безопасности
- Настройте оповещения о подозрительной активности
- Регулярно проверяйте журналы

### Документирование
- Обновляйте документацию по безопасности
- Документируйте все инциденты безопасности
- Обновляйте план действий при инцидентах безопасности 