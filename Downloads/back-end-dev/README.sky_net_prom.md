# Интеграция Prometheus и Grafana

Эта ветка (`sky_net_prom`) содержит изменения, связанные с интеграцией Prometheus и Grafana для мониторинга микросервисов.

## Обзор изменений

1. **Добавлен модуль метрик** (`common/modules/metrics`) для сбора метрик с микросервисов.
2. **Обновлена конфигурация Prometheus** (`startup/prometheus/prometheus.yml`) для сбора метрик со всех микросервисов.
3. **Добавлены сервисы Prometheus и Grafana** в `docker-compose.yml`.
4. **Настроена интеграция с Grafana Cloud** через `remote_write` в Prometheus.
5. **Добавлен дашборд для Grafana** (`startup/grafana/dashboards/microservices-dashboard.json`).
6. **Добавлена документация** по мониторингу (`docs/monitoring.md` и `docs/prometheus-grafana-integration.md`).

## Структура

```
common/modules/metrics/           # Модуль метрик для NestJS
├── index.ts                      # Экспорт всех компонентов модуля
├── metrics.module.ts             # Модуль NestJS
├── metrics.service.ts            # Сервис для работы с метриками
├── metrics.interceptor.ts        # Перехватчик для автоматического сбора метрик
└── metrics.definitions.ts        # Определения метрик

startup/prometheus/              # Конфигурация Prometheus
└── prometheus.yml               # Основной файл конфигурации

startup/grafana/                 # Конфигурация Grafana
├── dashboards/                  # Дашборды
│   └── microservices-dashboard.json  # Дашборд для микросервисов
└── provisioning/                # Автоматическая настройка
    ├── dashboards/              # Настройка дашбордов
    │   └── default.yaml         # Конфигурация провайдера дашбордов
    └── datasources/             # Настройка источников данных
        └── prometheus.yaml      # Конфигурация источника данных Prometheus

startup/scripts/                 # Скрипты
└── start-monitoring.sh          # Скрипт для запуска мониторинга

docs/                            # Документация
├── monitoring.md                # Общая документация по мониторингу
└── prometheus-grafana-integration.md  # Детальная документация по интеграции

.env.prom                        # Переменные окружения для мониторинга (не коммитить!)
```

## Метрики

Каждый микросервис должен экспортировать следующие метрики:

1. **http_requests_total** - счетчик HTTP-запросов
2. **http_request_duration_seconds** - гистограмма длительности HTTP-запросов
3. **app_info** - информация о приложении

## Текущее состояние и известные проблемы

В ходе тестирования были выявлены следующие проблемы:

1. **Проблемы с установкой зависимостей**
   - Пакеты `@willsoto/nestjs-prometheus` и `prom-client` установлены локально, но не доступны в контейнерах
   - В логах микросервисов видны ошибки TypeScript: `Cannot find module '@willsoto/nestjs-prometheus'`

2. **Проблемы с экспортом метрик**
   - Эндпоинт `/metrics` не доступен в микросервисах (ошибка 404)
   - Prometheus не может собирать метрики с микросервисов (статус UNKNOWN)

Подробные рекомендации по устранению проблем описаны в файле `docs/prometheus-grafana-integration.md`.

## Запуск

1. Убедитесь, что файл `.env.prom` содержит токен для Grafana Cloud:

   ```
   GRAFANA_TOKEN=your_token_here
   ```

2. Установите необходимые зависимости в контейнерах:

   ```bash
   docker-compose exec identity_service sh -c "cd /app && pnpm add @willsoto/nestjs-prometheus prom-client"
   docker-compose exec balance_service sh -c "cd /app && pnpm add @willsoto/nestjs-prometheus prom-client"
   docker-compose exec games_service sh -c "cd /app && pnpm add @willsoto/nestjs-prometheus prom-client"
   docker-compose exec gateway_service sh -c "cd /app && pnpm add @willsoto/nestjs-prometheus prom-client"
   ```

3. Перезапустите микросервисы:

   ```bash
   docker-compose restart identity balance games gateway
   ```

4. Запустите мониторинг:

   ```bash
   ./startup/scripts/start-monitoring.sh
   ```

5. Откройте Grafana по адресу <http://localhost:3009> (логин: `admin`, пароль: `admin`).

## Интеграция с новыми микросервисами

Для добавления метрик в новый микросервис:

1. Импортируйте модуль метрик:

   ```typescript
   import { MetricsModule, MetricsInterceptor } from '@common/modules/metrics';
   ```

2. Добавьте модуль метрик в imports:

   ```typescript
   @Module({
     imports: [
       // ...
       MetricsModule,
       // ...
     ],
   })
   ```

3. Добавьте перехватчик метрик в providers:

   ```typescript
   providers: [
     // ...
     {
       provide: APP_INTERCEPTOR,
       useClass: MetricsInterceptor,
     },
   ],
   ```

4. Добавьте job в конфигурацию Prometheus:

   ```yaml
   - job_name: 'new-service'
     metrics_path: '/metrics'
     static_configs:
       - targets: ['new-service:3000']
   ```

## Безопасность

Токен доступа к Grafana Cloud хранится в файле `.env.prom` и не должен быть добавлен в систему контроля версий. Файл `.env.prom` добавлен в `.gitignore`.

## Дополнительная информация

Для получения более подробной информации о текущем состоянии интеграции, выявленных проблемах и рекомендациях по их устранению, обратитесь к файлу `docs/prometheus-grafana-integration.md`.
