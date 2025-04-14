# Настройка CI/CD для проекта

Это руководство описывает, как настроить непрерывную интеграцию и развертывание (CI/CD) для автоматического деплоя проекта на сервер TimeWeb Cloud с использованием GitHub Actions.

## Предварительные требования

1. Доступ к серверу TimeWeb Cloud через SSH
2. Репозиторий проекта на GitHub
3. Доступ к настройкам репозитория на GitHub

## Шаг 1: Создание SSH-ключа для деплоя

На вашем локальном компьютере:

```bash
# Создание ключа SSH для деплоя
ssh-keygen -t ed25519 -C "github-deploy" -f github-deploy-key
```

Это создаст два файла:
- `github-deploy-key` (приватный ключ)
- `github-deploy-key.pub` (публичный ключ)

## Шаг 2: Добавление публичного ключа на сервер

Подключитесь к серверу TimeWeb и добавьте публичный ключ к авторизованным ключам:

```bash
# На сервере, под пользователем deploy
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "содержимое_github-deploy-key.pub" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Замените `содержимое_github-deploy-key.pub` фактическим содержимым файла.

## Шаг 3: Добавление секрета в GitHub

1. В вашем репозитории на GitHub перейдите в "Settings" > "Secrets and variables" > "Actions"
2. Нажмите "New repository secret"
3. Имя: `SSH_PRIVATE_KEY`
4. Значение: содержимое приватного ключа (`github-deploy-key`)
5. Нажмите "Add secret"

## Шаг 4: Настройка GitHub Actions

Создайте файл `.github/workflows/deploy.yml` в репозитории:

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
          ssh-keyscan -H 176.124.219.223 >> ~/.ssh/known_hosts
      
      - name: Deploy to TimeWeb
        env:
          SERVER_IP: 176.124.219.223
          SSH_USER: deploy
        run: |
          # Проверка подключения
          ssh $SSH_USER@$SERVER_IP "echo 'Connection successful'"
          
          # Деплой приложения
          ssh $SSH_USER@$SERVER_IP << 'ENDSSH'
            cd ~/game/src
            git pull
            cd ~/game
            docker compose down
            docker compose up --build -d
          ENDSSH
```

## Шаг 5: Проверка работы CI/CD

1. Внесите изменения в проект
2. Выполните коммит и отправьте изменения в ветку main на GitHub:

```bash
git add .
git commit -m "Тестирование CI/CD"
git push origin main
```

3. Перейдите на GitHub в раздел "Actions" вашего репозитория и проверьте выполнение workflow.

## Шаг 6: Проверка работы приложения

После успешного деплоя проверьте, что приложение запущено и доступно:

```bash
# Подключитесь к серверу
ssh deploy@176.124.219.223

# Проверьте статус Docker контейнеров
docker ps

# Проверьте логи приложения
docker compose logs -f
```

## Поздравляем!

Теперь ваш проект настроен для автоматического развертывания на сервер TimeWeb Cloud при каждом пуше в ветку main. Это значительно упрощает процесс разработки и деплоя. 