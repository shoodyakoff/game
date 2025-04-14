# Инструкция по развертыванию проекта на облачном сервере TimeWeb Cloud

## 1. Подготовка сервера

После создания сервера в TimeWeb Cloud с параметрами:
- **ОС:** Ubuntu 24.04
- **Процессор:** 1 x 3.3 ГГц
- **RAM:** 2 ГБ
- **NVMe:** 30 ГБ

Подключитесь к серверу по SSH:

```bash
ssh root@YOUR_SERVER_IP
```

## 2. Первоначальная настройка системы

```bash
#!/bin/bash
# Обновление системы
apt update && apt upgrade -y

# Установка базовых зависимостей
apt install -y curl wget git build-essential nginx certbot python3-certbot-nginx ufw

# Настройка файрвола
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

# Установка Docker и Docker Compose
curl -fsSL https://get.docker.com | sh
apt install -y docker-compose-plugin

# Добавление пользователя для деплоя
adduser deploy
usermod -aG sudo deploy
usermod -aG docker deploy

# Создание SSH ключей для автоматического деплоя
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
touch /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
```

## 3. Создание структуры проекта

Войдите под пользователем deploy:

```bash
su - deploy
```

Создайте директории для проекта:

```bash
mkdir -p ~/game
mkdir -p ~/game/data
mkdir -p ~/game/logs
mkdir -p ~/game/env
```

## 4. Настройка переменных окружения

Создайте файл с переменными окружения:

```bash
cat > ~/game/env/.env.production << 'EOL'
# Базовые настройки
NODE_ENV=production

# Clerk API ключи
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select

# Для обхода проблемы с Clerk при билде
NEXT_PUBLIC_CLERK_MOCK_MODE=true

# MongoDB
MONGODB_URI=mongodb://mongodb:27017/game-portal
JWT_SECRET=secure_jwt_secret_key
JWT_EXPIRE=30d
EOL
```

## 5. Клонирование проекта

```bash
cd ~/game
git clone https://github.com/your_username/game.git src
cd src
```

Создайте docker-compose файл для продакшена:

```bash
cat > ~/game/docker-compose.yml << 'EOL'
services:
  nextjs-app:
    build:
      context: ./src
      dockerfile: Dockerfile
      args:
        - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_valid_looking_clerk_key_for_build_12345
        - CLERK_SECRET_KEY=sk_test_valid_looking_clerk_secret_key_for_build_67890
        - NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
        - NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
        - NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
        - NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select
        - NEXT_PUBLIC_CLERK_MOCK_MODE=true
    ports:
      - "3000:3000"
    restart: always
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
      - NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
      - NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
      - NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
      - NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select
      - MONGODB_URI=${MONGODB_URI:-mongodb://mongodb:27017/game-portal}
      - JWT_SECRET=${JWT_SECRET:-secure_jwt_secret_key}
    volumes:
      - nextjs_data:/app/.next/cache
    networks:
      - app-network
    depends_on:
      - mongodb
    healthcheck:
      test: ["CMD", "wget", "--spider", "--quiet", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network
    restart: always
    environment:
      - MONGO_INITDB_DATABASE=game-portal
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongo localhost:27017/game-portal --quiet
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s

networks:
  app-network:
    driver: bridge

volumes:
  nextjs_data:
  mongodb_data:
EOL
```

## 6. Настройка Nginx

Вернитесь к пользователю root:

```bash
exit  # выход из пользователя deploy
```

Создайте конфигурацию Nginx:

```bash
cat > /etc/nginx/sites-available/game << 'EOL'
server {
    listen 80;
    server_name YOUR_SERVER_IP;  # замените на ваш домен, когда будет готов

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Улучшенные настройки безопасности
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy strict-origin-when-cross-origin;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://clerk.gotogrow.app https://*.clerk.accounts.dev; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https://images.clerk.dev https://via.placeholder.com; connect-src 'self' https://clerk.gotogrow.app https://*.clerk.accounts.dev https://api.clerk.dev; frame-src 'self' https://clerk.gotogrow.app https://*.clerk.accounts.dev; worker-src 'self' blob:;";
}
EOL

# Активация конфигурации
ln -s /etc/nginx/sites-available/game /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

## 7. Запуск приложения

```bash
cd /home/deploy/game
docker-compose up -d
```

## 8. Настройка CI/CD через GitHub Actions

### Создание SSH ключа для CI/CD

На вашем локальном компьютере:

```bash
ssh-keygen -t ed25519 -C "github-deploy" -f github-deploy-key
```

Добавьте публичный ключ в authorized_keys на сервере:

```bash
echo "публичный-ключ-отсюда" >> /home/deploy/.ssh/authorized_keys
```

### Создание директории для GitHub Actions в репозитории

На вашем локальном компьютере:

```bash
mkdir -p .github/workflows
```

### Создание файла рабочего процесса GitHub Actions

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to TimeWeb

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up SSH
        uses: webfactory/ssh-agent@v0.8.0
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}
      
      - name: Add server to known hosts
        run: |
          mkdir -p ~/.ssh
          ssh-keyscan -H YOUR_SERVER_IP >> ~/.ssh/known_hosts
      
      - name: Deploy to TimeWeb
        env:
          SERVER_IP: YOUR_SERVER_IP
          SSH_USER: deploy
        run: |
          # Проверка подключения
          ssh $SSH_USER@$SERVER_IP "echo 'Connection successful'"
          
          # Деплой приложения
          ssh $SSH_USER@$SERVER_IP << 'ENDSSH'
            cd ~/game/src
            git pull
            cd ~/game
            docker-compose down
            docker-compose up --build -d
          ENDSSH
```

### Добавление секретов в GitHub

В настройках репозитория на GitHub добавьте секреты:

- `SSH_PRIVATE_KEY`: Содержимое файла `github-deploy-key`

## 9. Настройка мониторинга и бэкапов

### Установка Netdata для мониторинга

```bash
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

### Настройка автоматических бэкапов

```bash
mkdir -p /root/scripts

cat > /root/scripts/backup.sh << 'EOL'
#!/bin/bash
# Скрипт для бэкапа MongoDB и файлов приложения

BACKUP_DIR=/home/deploy/game/backup
DATE=$(date +%Y-%m-%d-%H%M)

# Создание директории для бэкапа
mkdir -p $BACKUP_DIR

# Бэкап MongoDB
docker exec -t game_mongodb_1 mongodump --out /dump
docker cp game_mongodb_1:/dump $BACKUP_DIR/mongodb-$DATE
tar -czf $BACKUP_DIR/mongodb-$DATE.tar.gz $BACKUP_DIR/mongodb-$DATE
rm -rf $BACKUP_DIR/mongodb-$DATE

# Бэкап env-файлов
cp /home/deploy/game/env/* $BACKUP_DIR/env-$DATE/
tar -czf $BACKUP_DIR/env-$DATE.tar.gz $BACKUP_DIR/env-$DATE
rm -rf $BACKUP_DIR/env-$DATE

# Удаление старых бэкапов (старше 7 дней)
find $BACKUP_DIR -name "*.tar.gz" -type f -mtime +7 -delete
EOL

chmod +x /root/scripts/backup.sh

# Добавление в crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /root/scripts/backup.sh") | crontab -
```

## 10. Обновление SSL-сертификата (когда будет домен)

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 11. Проверка статуса приложения

```bash
# Проверка статуса Docker-контейнеров
docker ps

# Проверка логов Next.js приложения
docker logs -f game_nextjs-app_1

# Проверка доступности по HTTP
curl -I http://localhost:3000

# Проверка настроек Nginx
nginx -t
```

## 12. Что делать, если что-то пошло не так

### Если приложение не запускается:

```bash
# Проверка логов Docker
docker logs -f game_nextjs-app_1

# Проверка логов Nginx
tail -f /var/log/nginx/error.log

# Перезапуск контейнеров
cd /home/deploy/game
docker-compose down
docker-compose up -d

# Перезапуск Nginx
systemctl restart nginx
```

### Если не работает CI/CD:

1. Проверьте журналы действий в GitHub
2. Проверьте SSH-подключение вручную
3. Проверьте права доступа пользователя deploy

## 13. Дополнительные рекомендации

1. **Регулярно обновляйте систему:**
   ```bash
   apt update && apt upgrade -y
   ```

2. **Настройте логи-ротацию:**
   ```bash
   apt install -y logrotate
   ```

3. **Проверка безопасности:**
   ```bash
   apt install -y rkhunter
   rkhunter --update
   rkhunter --check
   ```

4. **Настройка резервного копирования на внешний сервис:**
   Рассмотрите использование rclone для копирования бэкапов в облачное хранилище.

5. **Мониторинг производительности:**
   Используйте установленный Netdata или настройте UptimeRobot для внешнего мониторинга доступности.

## 14. Особенности проекта с Clerk

Поскольку в проекте используется Clerk для аутентификации, важно учитывать несколько особенностей:

1. **Проблема с билдом**: В проекте реализован обход проблемы с Clerk при сборке через переменную `NEXT_PUBLIC_CLERK_MOCK_MODE=true` и тестовые ключи в `Dockerfile`.

2. **Переменные окружения**: Убедитесь, что все переменные Clerk корректно переданы в контейнер через файл `.env.production`.

3. **Безопасность ключей**: Храните ключи Clerk только в секретах GitHub и в защищенных .env файлах на сервере.

4. **Настройка webhooks**: При наличии домена настройте webhooks Clerk для синхронизации с вашей MongoDB.

## 15. Полезные ссылки

- [Документация Docker](https://docs.docker.com/)
- [Документация TimeWeb Cloud](https://timeweb.cloud/docs)
- [Документация Next.js](https://nextjs.org/docs)
- [Документация Clerk](https://clerk.dev/docs)
- [GitHub Actions](https://docs.github.com/en/actions) 