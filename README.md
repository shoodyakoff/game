# Game Portal

Игровой портал с авторизацией, выбором персонажа и игровыми механиками.

## Настройка окружения

### Для локальной разработки

1. **Клонирование репозитория:**
   ```bash
   git clone https://github.com/username/game.git
   cd game
   ```

2. **Создание файлов окружения:**
   - Скопируйте `.env.example` в `.env.local` для локальной разработки
   - Скопируйте `.env.example` в `.env.production` для продакшена
   - Заполните необходимые переменные окружения в обоих файлах

3. **Запуск с использованием Docker (рекомендуется):**
   ```bash
   # Локальная разработка с MongoDB в Docker
   npm run docker:up
   
   # Заполнение локальной БД тестовыми данными (только первый раз)
   npm run db:seed
   
   # ИЛИ синхронизация с продакшеном (требуется MongoDB Tools)
   npm run db:sync
   ```

4. **Разработка без Docker:**
   ```bash
   # Установка зависимостей
   npm install
   
   # Запуск Next.js в режиме разработки
   npm run dev
   ```

5. **Доступ к приложению:**
   - Откройте http://localhost:3000 в браузере
   - Для входа используйте тестовые учетные данные:
     - Обычный пользователь: `s.hoodyakoff@gmail.com` / `Test123!`
     - Администратор: `admin@example.com` / `Admin123!`

### Управление Docker-контейнерами

```bash
# Запуск контейнеров
npm run docker:up

# Остановка контейнеров
npm run docker:down

# Перезапуск контейнеров
npm run docker:restart

# Просмотр логов
npm run docker:logs
```

### Работа с базой данных

```bash
# Заполнение локальной БД тестовыми данными
npm run db:seed

# Синхронизация локальной БД с MongoDB Atlas
npm run db:sync
```

## Структура проекта

- `src/` - исходный код приложения
  - `pages/` - страницы Next.js
  - `components/` - React-компоненты
  - `server/` - серверный код
    - `models/` - модели MongoDB
    - `utils/` - утилиты
  - `styles/` - стили приложения
- `public/` - статические файлы
- `scripts/` - скрипты для управления БД
- `mongo-init/` - скрипты инициализации MongoDB

## Рабочие окружения

### Локальная разработка

- **База данных:** MongoDB в Docker-контейнере
- **URL:** http://localhost:3000
- **Файл конфигурации:** `.env.local`
- **Docker файл:** `docker-compose.yml`

### Продакшен

- **База данных:** MongoDB Atlas
- **URL:** https://shoodyakoff-game-13b1.twc1.net
- **Файл конфигурации:** `.env.production`
- **Docker файл:** `docker-compose.prod.yml`

## Деплой

1. **Сборка для продакшена:**
   ```bash
   npm run build
   ```

2. **Запуск в режиме продакшена:**
   ```bash
   npm run start
   ```

3. **Запуск через Docker в продакшене:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Настройка сервера Timeweb

1. Подключитесь к серверу через SSH:
```bash
ssh username@your-server.timeweb.ru
```

2. Загрузите скрипт настройки сервера:
```bash
scp server-setup.sh username@your-server.timeweb.ru:~/
```

3. Сделайте скрипт исполняемым и запустите его:
```bash
chmod +x server-setup.sh
sudo ./server-setup.sh
```

## Деплой проекта

### Вариант 1: Использование скрипта деплоя

1. Отредактируйте файл `deploy.sh`:
```bash
# Замените следующие переменные:
# SERVER_USER - ваш пользователь на сервере
# SERVER_HOST - хост вашего сервера
# SERVER_PATH - путь к директории на сервере
# DOMAIN - ваш домен
```

2. Сделайте скрипт исполняемым и запустите его:
```bash
chmod +x deploy.sh
./deploy.sh
```

### Вариант 2: Ручной деплой

1. Соберите проект:
```bash
npm run build
```

2. Подготовьте файлы для деплоя:
```bash
mkdir -p deploy
cp -r .next package.json package-lock.json public .env.production deploy/
mv deploy/.env.production deploy/.env
```

3. Создайте файл конфигурации PM2:
```bash
# В директории deploy создайте файл ecosystem.config.js:
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
```

4. Создайте архив:
```bash
tar -czf deploy.tar.gz -C deploy .
```

5. Загрузите архив на сервер:
```bash
scp deploy.tar.gz username@your-server.timeweb.ru:/home/username/your-site/
```

6. Подключитесь к серверу и разверните приложение:
```bash
ssh username@your-server.timeweb.ru
cd /home/username/your-site
tar -xzf deploy.tar.gz
rm deploy.tar.gz
npm install --production
npx pm2 start ecosystem.config.js
npx pm2 save
```

## Настройка Nginx

1. Загрузите файл конфигурации Nginx:
```bash
scp nginx.conf username@your-server.timeweb.ru:~/
```

2. Подключитесь к серверу и настройте Nginx:
```bash
ssh username@your-server.timeweb.ru
sudo mv ~/nginx.conf /etc/nginx/sites-available/your-domain.ru
sudo ln -s /etc/nginx/sites-available/your-domain.ru /etc/nginx/sites-enabled/
```

3. Отредактируйте файл конфигурации, заменив:
- `your-domain.ru` на ваш домен
- `/home/username/your-site` на путь к вашему приложению

4. Проверьте конфигурацию и перезапустите Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Настройка SSL-сертификата

1. Получите SSL-сертификат с помощью certbot:
```bash
sudo certbot --nginx -d your-domain.ru -d www.your-domain.ru
```

2. Следуйте инструкциям certbot для настройки сертификата

## Проверка работоспособности

1. Проверьте, что ваше приложение запущено:
```bash
pm2 status
```

2. Проверьте журналы приложения:
```bash
pm2 logs game-portal
```

3. Откройте ваш сайт в браузере и убедитесь, что он работает корректно:
```
https://your-domain.ru
```

## Обслуживание приложения

- Для перезапуска приложения: `pm2 restart game-portal`
- Для остановки приложения: `pm2 stop game-portal`
- Для запуска приложения: `pm2 start game-portal`
- Для просмотра логов: `pm2 logs game-portal`

## Безопасность

- Регулярно обновляйте зависимости: `npm update`
- Обновляйте Node.js до последней LTS версии
- Установите и настройте fail2ban для защиты от брутфорс-атак
- Регулярно обновляйте ОС и установленные пакеты

## Резервное копирование

Рекомендуется настроить регулярное резервное копирование:
- Базы данных MongoDB
- Директории с приложением
- Конфигурационных файлов

## Решение проблем

Если приложение не работает:
1. Проверьте логи приложения: `pm2 logs game-portal`
2. Проверьте логи Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Проверьте статус Nginx: `systemctl status nginx`
4. Убедитесь, что порт 3000 прослушивается: `netstat -tulpn | grep 3000`

## Последние обновления (28.11.2023)

### Улучшения процесса выбора персонажа и авторизации

1. **Улучшена страница авторизации**
   - Добавлена проверка статуса сессии
   - Реализована логика для перенаправления уже авторизованных пользователей
   - Улучшена обработка ошибок

2. **Улучшена работа с сессией**
   - Обновлен API эндпоинт выбора персонажа (`/api/character/select.ts`)
   - Логика обновления сессии не разрывает ее при выборе персонажа
   - Добавлен новый API эндпоинт для обновления сессии (`/api/auth/update-session.ts`)

3. **Улучшен middleware**
   - Добавлена более адекватная обработка маршрутов API (возврат JSON вместо редиректов)
   - Улучшена обработка статических ресурсов
   - Улучшена логика редиректов

4. **Улучшена компонент DashboardInitializer**
   - Проверяет и обновляет сессию при входе на Дашборд

5. **Исправлены основные баги авторизации**
   - Исправлен баг "Сессия не обновилась после выбора персонажа"
   - Исправлен баг с выходом из системы при выборе персонажа
   - Улучшена обработка редиректов

## Документация по проекту
