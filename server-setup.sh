#!/bin/bash
# Скрипт для первоначальной настройки сервера Timeweb

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Начинаем настройку сервера для Node.js приложения...${NC}"

# Обновление пакетов
echo -e "${YELLOW}Шаг 1: Обновление пакетов...${NC}"
apt-get update && apt-get upgrade -y
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при обновлении пакетов${NC}"
    exit 1
fi
echo -e "${GREEN}Пакеты успешно обновлены${NC}"

# Установка необходимых пакетов
echo -e "${YELLOW}Шаг 2: Установка необходимых пакетов...${NC}"
apt-get install -y curl wget git build-essential nginx certbot python3-certbot-nginx
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при установке пакетов${NC}"
    exit 1
fi
echo -e "${GREEN}Пакеты успешно установлены${NC}"

# Установка Node.js через NVM
echo -e "${YELLOW}Шаг 3: Установка Node.js...${NC}"
# Загрузка и установка NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
# Активация NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# Установка Node.js LTS
nvm install --lts
nvm use --lts
nvm alias default node
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при установке Node.js${NC}"
    exit 1
fi
echo -e "${GREEN}Node.js $(node -v) успешно установлен${NC}"

# Установка PM2
echo -e "${YELLOW}Шаг 4: Установка PM2...${NC}"
npm install -g pm2
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при установке PM2${NC}"
    exit 1
fi
echo -e "${GREEN}PM2 успешно установлен${NC}"

# Настройка автозапуска PM2
echo -e "${YELLOW}Шаг 5: Настройка автозапуска PM2...${NC}"
pm2 startup
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при настройке автозапуска PM2${NC}"
    exit 1
fi
echo -e "${GREEN}Автозапуск PM2 настроен${NC}"

# Базовая настройка Nginx
echo -e "${YELLOW}Шаг 6: Базовая настройка Nginx...${NC}"
systemctl enable nginx
systemctl start nginx
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при запуске Nginx${NC}"
    exit 1
fi
echo -e "${GREEN}Nginx успешно запущен${NC}"

# Настройка брандмауэра
echo -e "${YELLOW}Шаг 7: Настройка брандмауэра...${NC}"
apt-get install -y ufw
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при настройке брандмауэра${NC}"
    exit 1
fi
echo -e "${GREEN}Брандмауэр успешно настроен${NC}"

# Настройка директории для приложения
echo -e "${YELLOW}Шаг 8: Создание директории для приложения...${NC}"
# Замените username и your-site на свои значения
mkdir -p /home/username/your-site
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при создании директории${NC}"
    exit 1
fi
echo -e "${GREEN}Директория успешно создана${NC}"

echo -e "${GREEN}Сервер успешно настроен для размещения Node.js приложения!${NC}"
echo -e "${YELLOW}Следующие шаги:${NC}"
echo -e "1. Загрузите файлы приложения на сервер"
echo -e "2. Настройте Nginx (используйте подготовленный файл nginx.conf)"
echo -e "3. Получите SSL сертификат: certbot --nginx -d your-domain.ru -d www.your-domain.ru"
echo -e "4. Запустите приложение через PM2"

echo -e "${GREEN}Готово!${NC}" 