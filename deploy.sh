#!/bin/bash
# Скрипт для деплоя проекта на Timeweb

# Переменные (замените на свои)
SERVER_USER="cf68523"
SERVER_HOST="cf68523.tw1.ru"
SERVER_PATH="/var/www/cf68523/data/www/cf68523.tw1.ru"
DOMAIN="cf68523.tw1.ru"

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Начинаем процесс деплоя на Timeweb...${NC}"

# 1. Сборка проекта
echo -e "${YELLOW}Шаг 1: Сборка проекта...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при сборке проекта${NC}"
    exit 1
fi
echo -e "${GREEN}Сборка успешно завершена${NC}"

# 2. Создание архива для деплоя
echo -e "${YELLOW}Шаг 2: Подготовка файлов для деплоя...${NC}"
mkdir -p deploy
cp -r .next package.json package-lock.json public .env.production deploy/
mv deploy/.env.production deploy/.env

# 3. Создание deploy-config.js для PM2
cat > deploy/ecosystem.config.js << EOF
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

echo -e "${GREEN}Файлы подготовлены${NC}"

# 4. Создание архива
echo -e "${YELLOW}Шаг 3: Создание архива...${NC}"
tar -czf deploy.tar.gz -C deploy .
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при создании архива${NC}"
    exit 1
fi
echo -e "${GREEN}Архив создан${NC}"

# 5. Загрузка на сервер
echo -e "${YELLOW}Шаг 4: Загрузка на сервер...${NC}"
scp deploy.tar.gz $SERVER_USER@$SERVER_HOST:$SERVER_PATH/
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при загрузке файлов на сервер${NC}"
    exit 1
fi
echo -e "${GREEN}Файлы успешно загружены${NC}"

# 6. Выполнение команд на сервере
echo -e "${YELLOW}Шаг 5: Настройка на сервере...${NC}"
ssh $SERVER_USER@$SERVER_HOST << EOF
    cd $SERVER_PATH
    
    # Распаковка архива
    tar -xzf deploy.tar.gz
    rm deploy.tar.gz
    
    # Установка зависимостей
    npm install --production
    
    # Настройка PM2
    npx pm2 delete game-portal 2>/dev/null || true
    npx pm2 start ecosystem.config.js
    npx pm2 save
    
    echo "Деплой завершен"
EOF

if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при настройке на сервере${NC}"
    exit 1
fi

echo -e "${GREEN}Деплой успешно завершен!${NC}"
echo -e "${YELLOW}Не забудьте настроить Nginx и SSL сертификат на сервере${NC}"
echo -e "Пример конфигурации Nginx:"
echo -e "${YELLOW}-----------------------------------${NC}"
echo -e "server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}"
echo -e "${YELLOW}-----------------------------------${NC}"

# Очистка временных файлов
rm -rf deploy
rm deploy.tar.gz 2>/dev/null || true

echo -e "${GREEN}Готово!${NC}" 