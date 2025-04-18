# Руководство по деплою на Timeweb Cloud

## Подготовка к деплою

1. **Настройте MongoDB Atlas** 
   - Убедитесь, что у вас настроена база данных MongoDB Atlas
   - Проверьте, что IP-адреса серверов Timeweb добавлены в список разрешенных в Atlas

2. **Подготовьте переменные окружения**
   - Создайте файл `.env.production` с правильными настройками:
     ```
     MONGODB_URI=mongodb+srv://user:password@cluster...
     NEXTAUTH_URL=https://your-domain.ru
     NEXTAUTH_SECRET=your_secret_key
     JWT_SECRET=your_jwt_secret
     NODE_ENV=production
     ```

3. **Соберите приложение локально** (опционально, для проверки)
   ```bash
   npm run build
   ```

## Деплой через Docker на Timeweb Cloud

1. **Создайте контейнер в панели Timeweb Cloud**
   - Зайдите в панель управления [Timeweb Cloud](https://timeweb.cloud/)
   - Выберите "Контейнеры" -> "Создать"
   - Выберите конфигурацию (рекомендуется минимум 2 CPU, 4 GB RAM)

2. **Настройте SSH доступ**
   - Сгенерируйте SSH ключи, если их еще нет:
     ```bash
     ssh-keygen -t rsa -b 4096 -f ~/.ssh/timeweb_key
     ```
   - Добавьте публичный ключ в панели Timeweb Cloud

3. **Подключитесь по SSH к серверу**
   ```bash
   ssh -i ~/.ssh/timeweb_key user@server_ip
   ```

4. **Клонируйте репозиторий на сервер**
   ```bash
   git clone https://github.com/username/game.git
   cd game
   ```

5. **Создайте файл .env на сервере**
   ```bash
   nano .env.production
   # Скопируйте содержимое вашего локального .env.production
   ```

6. **Создайте и запустите контейнеры Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

7. **Проверьте логи для выявления ошибок**
   ```bash
   docker-compose -f docker-compose.prod.yml logs
   ```

## Настройка домена и HTTPS

1. **Настройте DNS запись**
   - Добавьте A-запись, указывающую на IP вашего сервера Timeweb Cloud

2. **Настройте HTTPS**
   - В панели Timeweb Cloud перейдите в раздел "Домены"
   - Выберите нужный домен и настройте SSL-сертификат

3. **Обновите переменные окружения**
   - Измените NEXTAUTH_URL и CORS настройки для нового домена
   - Перезапустите контейнеры:
     ```bash
     docker-compose -f docker-compose.prod.yml down
     docker-compose -f docker-compose.prod.yml up -d
     ```

## Обновление приложения

1. **Подключитесь к серверу**
   ```bash
   ssh -i ~/.ssh/timeweb_key user@server_ip
   ```

2. **Перейдите в директорию проекта**
   ```bash
   cd game
   ```

3. **Обновите репозиторий**
   ```bash
   git pull
   ```

4. **Перезапустите контейнеры**
   ```bash
   docker-compose -f docker-compose.prod.yml down
   docker-compose -f docker-compose.prod.yml build
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Мониторинг и поддержка

1. **Проверка состояния контейнеров**
   ```bash
   docker ps
   ```

2. **Просмотр логов**
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f
   ```

3. **Перезапуск отдельного контейнера**
   ```bash
   docker-compose -f docker-compose.prod.yml restart nextjs-app
   ```

4. **Полное удаление и переустановка контейнеров**
   ```bash
   docker-compose -f docker-compose.prod.yml down
   docker volume prune  # Осторожно: удаляет все неиспользуемые тома
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Настройка регулярного резервного копирования 

Для автоматического создания резервных копий базы данных, настройте crontab:

```bash
# Открыть редактор crontab
crontab -e

# Добавить следующие строки:
# Резервное копирование базы данных каждый день в 3:00
0 3 * * * cd /path/to/your/game && /path/to/your/game/scripts/run-backup.sh >> /path/to/your/game/logs/cron-backup.log 2>&1

# Синхронизация с другой базой данных каждую неделю по воскресеньям в 4:00
0 4 * * 0 cd /path/to/your/game && node scripts/sync-db.js >> /path/to/your/game/logs/cron-sync.log 2>&1
```

Убедитесь, что:
1. Директория `/path/to/your/game/logs` существует и имеет соответствующие права доступа
2. Скрипты в директории `scripts` имеют право на выполнение (`chmod +x scripts/*.sh`)
3. Пользователь, от имени которого запускается cron, имеет доступ к MongoDB

### Проверка создания резервных копий

Вы можете вручную запустить создание резервной копии:

```bash
# Создание резервной копии вручную
npm run db:backup

# Просмотр логов резервного копирования
cat logs/db_backup.log

# Просмотр созданных резервных копий
ls -la backup/
```

## Бэкап данных

1. **Настройте регулярные бэкапы MongoDB Atlas**
   - В панели MongoDB Atlas настройте автоматические бэкапы

2. **Ручной бэкап на локальный компьютер**
   ```bash
   # Используйте MongoDB Tools для резервного копирования
   mongodump --uri="mongodb+srv://user:password@cluster..." --out=./backup-$(date +%Y%m%d)
   
   # Архивируйте файлы
   tar -czf backup-$(date +%Y%m%d).tar.gz ./backup-$(date +%Y%m%d)
   ```

## Решение проблем

### Проблемы с подключением к MongoDB
1. Проверьте, что IP сервера Timeweb добавлен в список разрешенных в MongoDB Atlas
2. Проверьте правильность строки подключения в переменных окружения
3. Проверьте логи приложения на наличие ошибок подключения:
   ```bash
   docker-compose -f docker-compose.prod.yml logs nextjs-app | grep -i mongo
   ```

### Проблемы с CORS
1. Проверьте настройки CORS в переменных окружения
2. Убедитесь, что NEXTAUTH_URL и NEXT_PUBLIC_API_URL указывают на правильный домен

### Проблемы с Docker
1. Проверьте свободное место на диске:
   ```bash
   df -h
   ```
2. Очистите неиспользуемые ресурсы Docker:
   ```bash
   docker system prune -a
   ``` 

## Проверка автоматического деплоя

Эта строка добавлена для тестирования автоматического деплоя через GitHub Actions.
Время тестирования: 14 апреля 2023 года.

   Привет андрей

## Использование мок-режима для локального тестирования и CI/CD

Для локальной разработки или в средах, где недоступны API ключи Clerk, можно использовать мок-режим аутентификации.

### Настройка мок-режима

1. **Включите мок-режим через переменные окружения:**
   ```
   NEXT_PUBLIC_CLERK_MOCK_MODE=true
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="mock_key_not_for_validation"
   ```

2. **Сборка приложения в мок-режиме:**
   ```bash
   # Стандартная сборка в мок-режиме
   npm run build:mock
   
   # Сборка с патчингом проблемных модулей Clerk (рекомендуется для CI/CD)
   npm run build:mock-patched
   ```

3. **Сборка Docker-контейнера в мок-режиме:**
   ```bash
   docker build -f Dockerfile.mock -t gotogrow:mock .
   ```

4. **Запуск контейнера в мок-режиме:**
   ```bash
   docker run -it --rm -p 3000:3000 gotogrow:mock
   ```

### Решение проблем с Edge Runtime

В мок-режиме могут возникать проблемы с Edge Runtime и библиотеками Clerk, особенно при сборке Docker-образа. Для их решения:

1. **Используйте патчинг библиотек Clerk:**
   ```bash
   # Запуск патчинга модулей Clerk для мок-режима
   node scripts/prepare-mock-build.js
   ```

2. **Если возникает ошибка с атрибутами DOMException:**
   - Убедитесь, что используете Dockerfile.mock, который включает патчинг проблемных модулей
   - Проверьте, что переменная `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` установлена в значение `mock_key_not_for_validation`

3. **Если возникают ошибки с Edge Runtime:**
   - В файле next.config.js для мок-режима уже отключены Server Components и Edge Runtime
   - При необходимости можно усилить изоляцию, добавив в next.config.js:
   ```javascript
   experimental: {
     runtime: 'nodejs',
     serverComponents: false,
   }
   ```

### CI/CD с мок-режимом

При настройке CI/CD пайплайнов для тестирования без реальных ключей API:

1. **В GitHub Actions или другой CI-системе:**
   ```yaml
   env:
     NEXT_PUBLIC_CLERK_MOCK_MODE: 'true'
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'mock_key_not_for_validation'
   ```

2. **Для выполнения тестов используйте патчинг:**
   ```yaml
   - name: Build and test
     run: |
       npm run build:mock-patched
       npm test
   ```

### Переключение между режимами

Приложение имеет встроенную логику для автоматического определения режима работы:
- При наличии переменной `NEXT_PUBLIC_CLERK_MOCK_MODE=true` используется мок-аутентификация
- В остальных случаях используется стандартный режим с реальным Clerk API

При деплое на продакшн убедитесь, что переменная `NEXT_PUBLIC_CLERK_MOCK_MODE` не установлена или установлена в `false`.