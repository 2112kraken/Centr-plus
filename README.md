# CenterPlus Shooting Range

Веб-платформа для стрелкового комплекса CenterPlus с публичной частью и административной панелью.

## Технологический стек

- [Next.js 14](https://nextjs.org) (App Router + Server Components)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)
- [next-intl 3](https://next-intl-docs.vercel.app) (i18n)
- [tRPC](https://trpc.io) (типизированные RPC)
- [Prisma](https://prisma.io) (ORM)
- [NestJS 11](https://nestjs.com) (Backend API)
- [Turborepo](https://turbo.build) (монорепозиторий)

## Структура проекта

```
centerplus/
 ├─ src/                    # Next.js приложение
 │   ├─ app/                # App Router
 │   ├─ components/         # React компоненты
 │   ├─ server/api/         # tRPC роутеры
 │   └─ styles/             # Tailwind стили
 ├─ apps/
 │   └─ api/                # NestJS backend
 ├─ locales/                # uk.json, en.json
 └─ prisma/                 # schema.prisma
```

## Запуск проекта

```bash
# Установка зависимостей
pnpm install

# Запуск Next.js (фронтенд)
pnpm dev

# Запуск NestJS API (бэкенд)
pnpm dev:api
```

Фронтенд будет доступен по адресу http://localhost:3000, API - по адресу http://localhost:3001.

## Пример запроса к API

```bash
curl -X POST http://localhost:3001/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Петров",
    "email": "ivan@example.com",
    "phone": "+380991234567",
    "date": "2025-06-01T14:00:00Z",
    "rangeId": "range-1"
  }'
```

## Деплой

Проект настроен для деплоя на DigitalOcean App Platform. Подробные инструкции по деплою можно найти в файле [DEPLOY.md](./DEPLOY.md).

### Автоматический деплой

Репозиторий настроен для автоматического деплоя через GitHub Actions. При пуше в ветку `main` происходит:

1. Запуск линтера и тестов
2. Деплой на DigitalOcean App Platform
3. Миграция базы данных

### Конфигурация DigitalOcean

Файл `.do/app.yaml` содержит конфигурацию для DigitalOcean App Platform, которая определяет:

- Сервисы (web, api)
- Переменные окружения
- Базу данных
- Настройки масштабирования

## Запуск API

Проект включает в себя NestJS API, расположенный в директории `apps/api`. Для запуска API выполните следующую команду:

```bash
pnpm dev:api
```

API будет доступен по адресу http://localhost:3001.

### Пример запроса к API

```bash
curl -X POST http://localhost:3001/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Петров",
    "email": "ivan@example.com",
    "phone": "+380991234567",
    "date": "2025-06-01T14:00:00Z",
    "rangeId": "range-1"
  }'
```
