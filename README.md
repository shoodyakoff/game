# Game Portal - Деплой на Timeweb

Инструкция по развертыванию проекта на хостинге Timeweb.

## Подготовка к деплою

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yourusername/game-portal.git
cd game-portal
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env.production` (шаблон уже подготовлен в репозитории):
```bash
# Отредактируйте файл .env.production и укажите правильные данные:
# - Замените строку подключения к MongoDB
# - Установите сложный JWT_SECRET 
# - Укажите правильный домен в NEXT_PUBLIC_API_URL и NEXT_PUBLIC_APP_URL
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