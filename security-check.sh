#!/bin/bash

# Скрипт для проверки безопасности проекта
# Должен быть запущен в корне проекта

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Начинаем проверку безопасности проекта...${NC}\n"

# Проверка наличия файлов с секретами
echo -e "1. Проверка наличия секретных ключей и учетных данных в репозитории..."
SECRETS_CHECK=$(grep -r "SECRET\|PASSWORD\|MONGODB_URI\|API_KEY\|ACCESS_KEY\|TOKEN" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" --include="*.json" --exclude-dir="node_modules" --exclude="package-lock.json" --exclude="yarn.lock" .)

if [ -n "$SECRETS_CHECK" ]; then
  echo -e "${RED}[ОШИБКА] Найдены потенциальные секреты в коде:${NC}"
  echo "$SECRETS_CHECK"
  echo ""
else
  echo -e "${GREEN}[OK] Секреты не найдены в исходном коде${NC}\n"
fi

# Проверка приватных ключей
echo -e "2. Проверка наличия приватных ключей..."
KEYS_CHECK=$(find . -type f -name "*.pem" -o -name "*.key" -o -name "*id_rsa*" -o -name "*private*" | grep -v "node_modules")

if [ -n "$KEYS_CHECK" ]; then
  echo -e "${RED}[ОШИБКА] Найдены приватные ключи:${NC}"
  echo "$KEYS_CHECK"
  echo ""
else
  echo -e "${GREEN}[OK] Приватные ключи не найдены${NC}\n"
fi

# Проверка .env файлов
echo -e "3. Проверка .env файлов на наличие в репозитории..."
ENV_FILES=$(find . -name ".env*" | grep -v ".env.example" | grep -v "node_modules")

if [ -n "$ENV_FILES" ]; then
  echo -e "${YELLOW}[ПРЕДУПРЕЖДЕНИЕ] Найдены .env файлы:${NC}"
  echo "$ENV_FILES"
  echo -e "${YELLOW}Убедитесь, что они добавлены в .gitignore${NC}\n"
else
  echo -e "${GREEN}[OK] .env файлы не найдены или уже добавлены в .gitignore${NC}\n"
fi

# Проверка зависимостей npm
echo -e "4. Проверка зависимостей на уязвимости..."
if command -v npm &> /dev/null; then
  npm audit --json > npm_audit.json
  VULNS=$(cat npm_audit.json | grep -c "\"severity\"")
  
  if [ "$VULNS" -gt 0 ]; then
    echo -e "${YELLOW}[ПРЕДУПРЕЖДЕНИЕ] Найдены уязвимости в зависимостях:${NC}"
    npm audit
    echo -e "\n${YELLOW}Рекомендуется выполнить: npm audit fix${NC}\n"
  else
    echo -e "${GREEN}[OK] Уязвимости в зависимостях не обнаружены${NC}\n"
  fi
  
  # Очистка
  rm npm_audit.json
else
  echo -e "${YELLOW}[ПРОПУЩЕНО] npm не установлен${NC}\n"
fi

# Проверка middleware и защиты от CSRF
echo -e "5. Проверка наличия защиты от CSRF..."
CSRF_CHECK=$(grep -r "csrf\|CSRF" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" --exclude-dir="node_modules" .)

if [ -n "$CSRF_CHECK" ]; then
  echo -e "${GREEN}[OK] Найдена защита от CSRF${NC}\n"
else
  echo -e "${YELLOW}[ПРЕДУПРЕЖДЕНИЕ] Не найдена явная защита от CSRF. Рекомендуется добавить механизм защиты от CSRF-атак${NC}\n"
fi

# Проверка CSP
echo -e "6. Проверка наличия Content Security Policy..."
CSP_CHECK=$(grep -r "Content-Security-Policy\|CSP" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" --exclude-dir="node_modules" .)

if [ -n "$CSP_CHECK" ]; then
  echo -e "${GREEN}[OK] Найдены настройки Content Security Policy${NC}\n"
else
  echo -e "${YELLOW}[ПРЕДУПРЕЖДЕНИЕ] Не найдены настройки Content Security Policy. Рекомендуется добавить заголовки CSP${NC}\n"
fi

# Проверка настроек безопасности в package.json
echo -e "7. Проверка настроек безопасности в package.json..."
SECURITY_DEPS=$(grep -c "helmet\|security\|xss\|sanitize\|validator\|rate-limit" package.json)

if [ "$SECURITY_DEPS" -gt 0 ]; then
  echo -e "${GREEN}[OK] Найдены библиотеки безопасности в package.json${NC}\n"
else
  echo -e "${YELLOW}[ПРЕДУПРЕЖДЕНИЕ] Не найдены специальные библиотеки безопасности в package.json${NC}\n"
fi

# Проверка настроек безопасности в next.config.js
echo -e "8. Проверка настроек безопасности в next.config.js..."
if [ -f "next.config.js" ]; then
  SECURITY_HEADERS=$(grep -c "headers\|security\|X-\|Content-Security\|Strict-Transport" next.config.js)
  
  if [ "$SECURITY_HEADERS" -gt 0 ]; then
    echo -e "${GREEN}[OK] Найдены настройки безопасности в next.config.js${NC}\n"
  else
    echo -e "${YELLOW}[ПРЕДУПРЕЖДЕНИЕ] Не найдены настройки заголовков безопасности в next.config.js${NC}\n"
  fi
else
  echo -e "${RED}[ОШИБКА] Файл next.config.js не найден${NC}\n"
fi

# Общий вывод
echo -e "${YELLOW}Проверка безопасности завершена. Просмотрите предупреждения выше и примените необходимые улучшения.${NC}"
echo -e "${YELLOW}Для обеспечения безопасности учетных данных рекомендуется использовать переменные окружения на сервере.${NC}" 