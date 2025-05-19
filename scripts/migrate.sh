#!/bin/bash

# Скрипт для миграции базы данных PostgreSQL на DigitalOcean

# Проверка наличия переменных окружения
if [ -z "$DATABASE_URL" ]; then
  echo "Ошибка: Переменная окружения DATABASE_URL не установлена"
  echo "Установите строку подключения к базе данных: export DATABASE_URL=postgresql://doadmin:ваш-пароль@db-postgresql-fra1-67118-do-user-20839386-0.d.db.ondigitalocean.com:25060/defaultdb?sslmode=require"
  exit 1
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
log "🚀 Начало процесса миграции базы данных"

# Шаг 1: Проверка подключения к базе данных
log "📋 Проверка подключения к базе данных"
npx prisma db pull --force
check_status "Проверка подключения к базе данных"

# Шаг 2: Генерация клиента Prisma
log "🔄 Генерация клиента Prisma"
npx prisma generate
check_status "Генерация клиента Prisma"

# Шаг 3: Применение миграций
log "🔄 Применение миграций"
npx prisma migrate deploy
check_status "Применение миграций"

# Шаг 4: Проверка состояния базы данных
log "🔍 Проверка состояния базы данных"
npx prisma db pull
check_status "Проверка состояния базы данных"

# Завершение миграции
log "✅ Процесс миграции базы данных завершен"