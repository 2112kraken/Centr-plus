#!/bin/bash

# Скрипт для миграции базы данных PostgreSQL на DigitalOcean App Platform

# Проверка наличия doctl
if ! command -v doctl &> /dev/null; then
  echo "Ошибка: doctl не установлен"
  echo "Установите doctl: https://docs.digitalocean.com/reference/doctl/how-to/install/"
  exit 1
fi

# Проверка наличия токена DigitalOcean
if [ -z "$DO_TOKEN" ]; then
  echo "Ошибка: Переменная окружения DO_TOKEN не установлена"
  echo "Установите токен DigitalOcean: export DO_TOKEN=ваш-токен-digitalocean"
  exit 1
fi

# Проверка наличия ID приложения
if [ -z "$DO_APP_ID" ]; then
  echo "Ошибка: Переменная окружения DO_APP_ID не установлена"
  echo "Установите ID приложения DigitalOcean: export DO_APP_ID=ваш-id-приложения"
  exit 1
fi

# Проверка наличия переменных окружения
if [ -z "$DATABASE_URL" ]; then
  echo "Предупреждение: Переменная окружения DATABASE_URL не установлена"
  echo "Будет использоваться база данных, настроенная в App Platform"
fi

# Функция для вывода сообщений
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Функция для проверки статуса выполнения команды
check_status() {
  if [ $? -eq 0 ]; then
    log "✅ $1"
  else
    log "❌ $1"
    exit 1
  fi
}

# Начало миграции
log "🚀 Начало процесса миграции базы данных на App Platform"

# Аутентификация doctl
doctl auth init -t $DO_TOKEN
check_status "Аутентификация doctl"

# Шаг 1: Запуск миграции через doctl
log "🔄 Запуск миграции базы данных через doctl"
doctl apps create-deployment-component-log $DO_APP_ID --component-name web --command "npx prisma migrate deploy"
check_status "Запуск миграции базы данных"

# Шаг 2: Проверка статуса миграции
log "🔍 Проверка статуса миграции"
doctl apps list-deployments $DO_APP_ID --format ID,Status,Progress.Steps.Status --no-header | head -1
check_status "Проверка статуса миграции"

# Шаг 3: Проверка состояния базы данных (опционально, если DATABASE_URL установлен)
if [ ! -z "$DATABASE_URL" ]; then
  log "🔍 Проверка состояния базы данных"
  npx prisma db pull
  check_status "Проверка состояния базы данных"
fi

# Завершение миграции
log "✅ Процесс миграции базы данных на App Platform завершен"