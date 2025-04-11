# Мониторинг с использованием Prometheus и Grafana

В этом документе описывается интеграция Prometheus и Grafana для мониторинга микросервисов.

## Обзор

Система мониторинга состоит из следующих компонентов:

1. **Prometheus** - система сбора и хранения метрик
2. **Grafana** - система визуализации метрик
3. **Экспортеры метрик** - компоненты, которые собирают метрики с микросервисов

## Архитектура

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Микросервис │     │ Микросервис │     │ Микросервис │
│  (identity) │     │  (balance)  │     │   (games)   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │ /metrics          │ /metrics          │ /metrics
       │                   │                   │
┌──────▼───────────────────▼───────────────────▼──────┐
│                                                     │
│                     Prometheus                      │
│                                                     │
└──────────────────────────┬──────────────────────────┘
                           │
                           │ Запросы метрик
                           │
┌──────────────────────────▼──────────────────────────┐
│                                                     │
│                       Grafana                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Настройка Prometheus

Prometheus настроен для сбора метрик со всех микросервисов. Конфигурация находится в файле `startup/prometheus/prometheus.yml`.

Основные параметры:

- `scrape_interval`: 15s - интервал сбора метрик
- `evaluation_interval`: 15s - интервал вычисления правил

Для каждого микросервиса настроен отдельный job, который собирает метрики с эндпоинта `/metrics`.

## Настройка Grafana

Grafana настроена для визуализации метрик, собранных Prometheus. Доступ к Grafana осуществляется по адресу <http://localhost:3009>.

Учетные данные по умолчанию:

- Логин: `admin`
- Пароль: `admin`

## Интеграция с Grafana Cloud

Для отправки метрик в Grafana Cloud используется функция `remote_write` в Prometheus. Токен доступа хранится в файле `.env.prom` и не должен быть добавлен в систему контроля версий.

## Метрики микросервисов

Каждый микросервис экспортирует следующие метрики:

1. **http_requests_total** - счетчик HTTP-запросов с метками:
   - `method` - HTTP-метод (GET, POST, и т.д.)
   - `route` - путь запроса
   - `statusCode` - код ответа

2. **http_request_duration_seconds** - гистограмма длительности HTTP-запросов с метками:
   - `method` - HTTP-метод
   - `route` - путь запроса

3. **app_info** - информация о приложении с метками:
   - `version` - версия приложения

Кроме того, Prometheus собирает стандартные метрики Node.js, такие как использование памяти, загрузка CPU и т.д.

## Добавление метрик в новый микросервис

Для добавления метрик в новый микросервис необходимо:

1. Импортировать модуль метрик:

   ```typescript
   import { MetricsModule, MetricsInterceptor } from '@common/modules/metrics';
   ```

2. Добавить модуль метрик в imports:

   ```typescript
   @Module({
     imports: [
       // ...
       MetricsModule,
       // ...
     ],
   })
   ```

3. Добавить перехватчик метрик в providers:

   ```typescript
   providers: [
     // ...
     {
       provide: APP_INTERCEPTOR,
       useClass: MetricsInterceptor,
     },
   ],
   ```

4. Добавить job в конфигурацию Prometheus:

   ```yaml
   - job_name: 'new-service'
     metrics_path: '/metrics'
     static_configs:
       - targets: ['new-service:3000']
   ```

## Запуск мониторинга

Для запуска мониторинга используйте скрипт:

```bash
./startup/scripts/start-monitoring.sh
```

Этот скрипт запускает Prometheus и Grafana с использованием Docker Compose.

## Безопасность

Токен доступа к Grafana Cloud хранится в файле `.env.prom` и не должен быть добавлен в систему контроля версий. Файл `.env.prom` добавлен в `.gitignore`.

## Дополнительные ресурсы

- [Документация Prometheus](https://prometheus.io/docs/introduction/overview/)
- [Документация Grafana](https://grafana.com/docs/)
- [Документация NestJS Prometheus](https://github.com/willsoto/nestjs-prometheus)
