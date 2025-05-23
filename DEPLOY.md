# Инструкция по деплою CenterPlus Shooting Range

## 1. Заливка кода в GitHub

### Настройка аутентификации GitHub

GitHub больше не поддерживает аутентификацию по паролю. Вместо этого нужно использовать один из следующих методов:

#### Вариант 1: Использование Personal Access Token (PAT)

1. Перейдите в настройки GitHub: https://github.com/settings/tokens
2. Нажмите "Generate new token (classic)"
3. Дайте токену название (например, "CenterPlus Deploy")
4. Выберите области действия (scopes): минимум `repo` и `workflow`
5. Нажмите "Generate token" и скопируйте токен

Затем используйте этот токен вместо пароля при запросе аутентификации:

```bash
git push -u origin main
# Когда запросит пароль, вставьте токен
```

#### Вариант 2: Настройка SSH-ключей

1. Создайте SSH-ключ (если у вас его еще нет):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. Добавьте ключ в SSH-агент:
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

3. Скопируйте публичный ключ:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

4. Добавьте ключ в настройках GitHub: https://github.com/settings/keys

5. Измените URL удаленного репозитория на SSH:
   ```bash
   git remote set-url origin git@github.com:2112kraken/Centr-plus.git
   git push -u origin main
   ```

## 2. Деплой на DigitalOcean

### Создание приложения в App Platform

1. Войдите в панель управления DigitalOcean: https://cloud.digitalocean.com/
2. Перейдите в раздел "Apps" и нажмите "Create App"
3. Выберите GitHub как источник кода и подключите репозиторий `2112kraken/Centr-plus`
4. Настройте компоненты приложения:
   - **Web Service**: Выберите директорию `/` и тип "Next.js"
   - **API Service**: Выберите директорию `/apps/api` и тип "Node.js"

5. Настройте переменные окружения:
   ```
   # База данных
   DATABASE_URL=postgresql://doadmin:${DB_PASSWORD}@db-postgresql-fra1-67118-do-user-20839386-0.d.db.ondigitalocean.com:25060/defaultdb?sslmode=require
   
   # Аутентификация (Clerk)
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   
   # Интернационализация
   DEFAULT_LOCALE=uk
   SUPPORTED_LOCALES=uk,en
   
   # Binotel (для API)
   BINOTEL_API_KEY=your_binotel_api_key
   BINOTEL_SECRET=your_binotel_secret
   BINOTEL_WIDGET_ID=your_binotel_widget_id
   
   # Для деплоя (пропуск валидации переменных окружения)
   SKIP_ENV_VALIDATION=true
   ```
   
   > **Важно**: Все переменные окружения должны быть заполнены корректными значениями. Для деплоя можно использовать `SKIP_ENV_VALIDATION=true`, чтобы пропустить валидацию переменных окружения на этапе сборки.
   
   > **База данных**: Проект настроен на использование существующей базы данных PostgreSQL на DigitalOcean. Данные для подключения уже указаны в файле `.do/app.yaml`.

6. Нажмите "Create Resources" для создания приложения

### Настройка CI/CD для автоматического деплоя

Файл `.github/workflows/ci.yml` уже содержит базовую настройку CI. Для настройки автоматического деплоя добавьте следующие секреты в настройках репозитория GitHub:

1. Перейдите в настройки репозитория: https://github.com/2112kraken/Centr-plus/settings/secrets/actions
2. Добавьте следующие секреты:
   - `DO_TOKEN`: API токен DigitalOcean
   - `DO_APP_ID`: ID вашего приложения в App Platform

Обновите файл `.github/workflows/ci.yml`, добавив следующий код в секцию `deploy`:

```yaml
deploy:
  needs: build-test
  runs-on: ubuntu-latest
  steps:
    - uses: digitalocean/app_action@v1
      with:
        token: ${{ secrets.DO_TOKEN }}
        app_name: centerplus
    - name: Migrate DB
      run: ssh ${{ secrets.DROPLET_SSH }} "cd /srv/api && docker compose exec api npx prisma migrate deploy"
```

## 3. Настройка базы данных

Проект уже настроен на использование существующей базы данных PostgreSQL на DigitalOcean. Данные для подключения:

```
Host: db-postgresql-fra1-67118-do-user-20839386-0.d.db.ondigitalocean.com
Port: 25060
Database: defaultdb
Username: doadmin
Password: ${DB_PASSWORD}
SSL Mode: require
```

Строка подключения:
```
postgresql://doadmin:${DB_PASSWORD}@db-postgresql-fra1-67118-do-user-20839386-0.d.db.ondigitalocean.com:25060/defaultdb?sslmode=require
```

Эта строка подключения уже указана в файле `.do/app.yaml` для обоих сервисов (web и api).

## 4. Проверка деплоя

После успешного деплоя ваше приложение будет доступно по URL, предоставленному DigitalOcean App Platform. Обычно это что-то вроде `https://centerplus-xxxxx.ondigitalocean.app`.

## 5. Настройка домена (опционально)

1. В панели управления DigitalOcean перейдите в раздел "Apps" и выберите ваше приложение
2. Перейдите на вкладку "Settings" и выберите "Domains"
3. Нажмите "Add Domain" и введите ваш домен (например, centerplus.ua)
4. Следуйте инструкциям для настройки DNS-записей

## 6. Мониторинг и логи

- Логи доступны в разделе "Apps" > [Ваше приложение] > "Insights" > "Logs"
- Метрики производительности доступны в разделе "Apps" > [Ваше приложение] > "Insights" > "Metrics"

## 7. Устранение проблем при деплое

### Ошибка "Invalid environment variables"

Если вы получаете ошибку "Invalid environment variables" при деплое, у вас есть два варианта:

1. **Вариант 1: Настроить все необходимые переменные окружения**
   - `DATABASE_URL` - URL для подключения к базе данных PostgreSQL
   - `CLERK_SECRET_KEY` и `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - ключи для аутентификации
   - `DEFAULT_LOCALE` и `SUPPORTED_LOCALES` - настройки интернационализации
   - `BINOTEL_API_KEY`, `BINOTEL_SECRET` и `BINOTEL_WIDGET_ID` - для API

   Формат переменных окружения должен быть корректным:
   - URL базы данных должен иметь формат: `postgres://username:password@host:port/database`
   - Строковые значения не должны содержать пробелов в начале или конце

2. **Вариант 2: Использовать SKIP_ENV_VALIDATION (рекомендуется для деплоя)**
   - Добавьте переменную окружения `SKIP_ENV_VALIDATION=true` в настройках App Platform
   - Это позволит пропустить валидацию переменных окружения на этапе сборки
   - Переменные окружения будут проверены при запуске приложения

   В файле `.do/app.yaml` уже добавлена эта переменная:
   ```yaml
   - key: SKIP_ENV_VALIDATION
     scope: BUILD_TIME
     value: "true"
   ```

### Ошибка "Node version not specified in package.json"

Укажите конкретную версию Node.js в package.json:

```json
"engines": {
  "node": "18.x"
}
```

> **Важно**: Не используйте диапазоны с символами ">" или ">=", так как они считаются небезопасными в Heroku/DigitalOcean. Вместо этого используйте формат "18.x", который указывает на последнюю доступную версию Node.js 18.