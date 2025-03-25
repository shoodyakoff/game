#!/bin/bash
# Скрипт для деплоя проекта на Timeweb (упрощенная версия)

# Переменные (замените на свои)
SERVER_USER="cf68523"
SERVER_HOST="cf68523.tw1.ru"
SERVER_PATH="/home/cf68523/gotogrow/public_html"
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

# 2. Подготовка файлов для деплоя
echo -e "${YELLOW}Шаг 2: Подготовка файлов для деплоя...${NC}"
mkdir -p deploy-full

# Копируем все файлы, необходимые для работы Next.js
cp -r .next deploy-full/
cp -r public deploy-full/
cp -r src deploy-full/         # Копируем исходный код (компоненты, страницы, хуки и т.д.)
cp -r pages deploy-full/       # Страницы Next.js (если они находятся в корне, а не в src)
cp -r components deploy-full/  # Компоненты (если они находятся в корне, а не в src)
cp -r styles deploy-full/      # Стили (если они находятся в корне, а не в src)
cp package.json package-lock.json next.config.js deploy-full/ 2>/dev/null || true
cp .env.production deploy-full/.env 2>/dev/null || true

# Создание .htaccess файла для Apache
cat > deploy-full/.htaccess << EOF
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # Если файл или директория существуют, используй их напрямую
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    
    # Для статичных файлов Next.js
    RewriteRule ^_next/(.*)$ .next/$1 [L]
    
    # Для API маршрутов и других динамических страниц
    RewriteRule ^(.*)$ index.php [L]
</IfModule>
EOF

# Создание простого PHP файла для отображения статической страницы
cat > deploy-full/index.php << EOF
<?php
// Отображение статической HTML страницы
include './.next/server/pages/index.html';
?>
EOF

echo -e "${GREEN}Файлы подготовлены${NC}"

# 3. Создание архива
echo -e "${YELLOW}Шаг 3: Создание архива...${NC}"
tar -czf deploy-full.tar.gz -C deploy-full .
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при создании архива${NC}"
    exit 1
fi
echo -e "${GREEN}Архив создан. Файл: deploy-full.tar.gz${NC}"

# 4. Выводим список директорий и важных файлов в архиве
echo -e "${YELLOW}Содержимое архива (основные директории):${NC}"
tar -tf deploy-full.tar.gz | grep -v "/$" | head -n 20

echo -e "${YELLOW}Теперь вам нужно:${NC}"
echo -e "1. Загрузить архив deploy-full.tar.gz на сервер через файловый менеджер Timeweb"
echo -e "2. Распаковать архив в директорию public_html"
echo -e "3. Настроить Node.js в панели управления Timeweb (если доступно)"
echo -e "4. Установить зависимости: npm install --production"
echo -e "5. Запустить приложение: npm start"
echo -e ""
echo -e "${RED}Важно:${NC} Для полноценной работы Next.js приложения с API маршрутами"
echo -e "на шаред-хостинге может потребоваться использование VPS/VDS с Node.js"

# Очистка временных файлов
rm -rf deploy-full

echo -e "${GREEN}Готово!${NC}" 