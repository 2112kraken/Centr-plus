# Интеграция Prometheus и Grafana

Эта ветка (`sky_net_prom`) содержит изменения, связанные с интеграцией Prometheus и Grafana для мониторинга микросервисов.

## Обзор изменений

1. **Добавлен модуль метрик** (`common/modules/metrics`) для сбора метрик с микросервисов.
2. **Обновлена конфигурация Prometheus** (`startup/prometheus/prometheus.yml`) для сбора метрик со всех микросервисов.
3. **Добавлены сервисы Prometheus и Grafana** в `docker-compose.yml`.
4. **Настроена интеграция с Grafana Cloud** через `remote_write` в Prometheus.
5. **Добавлен дашборд для Grafana** (`startup/grafana/dashboards/microservices-dashboard.json`).
6. **Добавлена документация** по мониторингу (`docs/monitoring.md`).

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
└── monitoring.md                # Документация по мониторингу

.env.prom                        # Переменные окружения для мониторинга (не коммитить!)
```

## Метрики

Каждый микросервис экспортирует следующие метрики:

1. **http_requests_total** - счетчик HTTP-запросов
2. **http_request_duration_seconds** - гистограмма длительности HTTP-запросов
3. **app_info** - информация о приложении

## Запуск

1. Убедитесь, что файл `.env.prom` содержит токен для Grafana Cloud:

   ```
   GRAFANA_TOKEN=your_token_here
   ```

2. Запустите мониторинг:

   ```bash
   ./startup/scripts/start-monitoring.sh
   ```

3. Откройте Grafana по адресу <http://localhost:3009> (логин: `admin`, пароль: `admin`).

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
