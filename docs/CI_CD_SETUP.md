# Настройка CI/CD для автоматического деплоя на TimeWeb

Для автоматического деплоя на сервер TimeWeb при пуше в ветку `main` следуйте инструкциям ниже:

## 1. Создание и настройка SSH ключей

1. Сгенерируйте новую пару SSH ключей:
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/timeweb_deploy -N ""
   ```

2. Скопируйте публичный ключ:
   ```bash
   cat ~/.ssh/timeweb_deploy.pub
   ```

3. Добавьте этот публичный ключ на сервер TimeWeb:
   ```bash
   ssh deploy@176.124.219.223
   # После подключения к серверу:
   mkdir -p ~/.ssh
   echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICQvurNGkMCNzC8Ci5B8XiBJvqgJk9/4/29zSr5ISsFu stas@Noutbuk-Stas.local" >> ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   exit
   ```

## 2. Добавление приватного ключа в GitHub Secrets

1. Скопируйте приватный ключ:
   ```bash
   cat ~/.ssh/timeweb_deploy
   ```

2. Перейдите в настройки GitHub репозитория:
   - Откройте https://github.com/username/game/settings/secrets/actions (замените username на ваше имя пользователя)
   - Нажмите "New repository secret"
   - Имя: `SSH_PRIVATE_KEY`
   - Значение: вставьте скопированный приватный ключ (включая строки BEGIN и END)
   - Нажмите "Add secret"

## 3. Проверка файла workflow

Убедитесь, что в вашем репозитории есть файл `.github/workflows/deploy.yml` со следующим содержимым:

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
            cd ~/game
            git pull
            docker compose down
            docker compose up --build -d
          ENDSSH
```

## 4. Тестирование автоматического деплоя

После настройки сделайте небольшое изменение в репозитории, закоммитьте и отправьте в ветку `main`:

```bash
git add .
git commit -m "Тест автоматического деплоя"
git push origin main
```

Затем перейдите в раздел "Actions" вашего GitHub репозитория для проверки статуса выполнения workflow.

## 5. Рекомендации по безопасности

Для обеспечения безопасности при работе с CI/CD рекомендуется:

1. **Ограничение доступа к серверу**: 
   - Используйте отдельного пользователя для деплоя (как в нашем случае `deploy`).
   - Настройте SSH доступ только с использованием ключей, отключите доступ по паролю.
   - Рассмотрите возможность ограничения IP-адресов, с которых возможно подключение.

2. **Работа с конфиденциальной информацией**:
   - IP-адрес сервера не является критически чувствительной информацией, но хорошей практикой будет хранить его в GitHub Secrets.
   - Рассмотрите возможность переноса IP-адреса в секреты, изменив файл `deploy.yml`:
     ```yaml
     env:
       SERVER_IP: ${{ secrets.SERVER_IP }}
     ```

3. **Обновление workflow**:
   - Используйте фиксированные версии действий GitHub (напр., `actions/checkout@v3`), чтобы избежать проблем с несовместимостью.
   - Регулярно обновляйте версии действий для устранения потенциальных уязвимостей.

4. **Безопасность ключей**:
   - Используйте разные SSH ключи для разных сервисов и серверов.
   - Регулярно обновляйте SSH ключи (например, раз в 6-12 месяцев).
   - При увольнении сотрудника, имевшего доступ к ключам, обязательно замените их.

5. **Переменные окружения**:
   - Используйте мок-режим только для разработки и тестирования.
   - Для продакшена все чувствительные данные, такие как `CLERK_SECRET_KEY`, должны храниться только в защищенных переменных окружения на сервере.
   - Никогда не храните реальные секретные ключи в коде или документации. 