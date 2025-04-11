# Интеграция Prometheus и Grafana в микросервисную архитектуру

## Текущее состояние

В рамках ветки `sky_net_prom` была выполнена базовая интеграция Prometheus и Grafana для мониторинга микросервисов. Однако, в ходе тестирования были выявлены проблемы, требующие дополнительной настройки.

### Что реализовано

1. **Модуль метрик для NestJS**
   - Создан универсальный модуль `common/modules/metrics` для сбора метрик с микросервисов
   - Реализован перехватчик для автоматического сбора метрик HTTP-запросов
   - Добавлены базовые метрики: счетчик запросов, гистограмма длительности, информация о приложении

2. **Интеграция модуля метрик в микросервисы**
   - Модуль метрик добавлен в сервисы `balance`, `identity`, `games` и `gateway`
   - Настроен перехватчик для автоматического сбора метрик HTTP-запросов

3. **Настройка Prometheus**
   - Добавлен сервис Prometheus в docker-compose.yml
   - Обновлена конфигурация для сбора метрик со всех микросервисов
   - Настроена интеграция с Grafana Cloud через remote_write
   - Токен Grafana Cloud безопасно хранится в файле .env.prom

4. **Настройка Grafana**
   - Добавлен сервис Grafana в docker-compose.yml
   - Создан базовый дашборд для мониторинга микросервисов
   - Настроено автоматическое подключение источника данных Prometheus

### Выявленные проблемы

1. **Проблемы с установкой зависимостей**
   - Пакеты `@willsoto/nestjs-prometheus` и `prom-client` установлены локально, но не доступны в контейнерах
   - В логах микросервисов видны ошибки TypeScript: `Cannot find module '@willsoto/nestjs-prometheus'`

2. **Проблемы с экспортом метрик**
   - Эндпоинт `/metrics` не доступен в микросервисах (ошибка 404)
   - Prometheus не может собирать метрики с микросервисов (статус UNKNOWN)

## Рекомендации по устранению проблем

### 1. Корректная установка зависимостей

Необходимо обеспечить доступность пакетов `@willsoto/nestjs-prometheus` и `prom-client` внутри контейнеров:

```bash
# Добавить зависимости в package.json
docker-compose exec identity_service sh -c "cd /app && pnpm add @willsoto/nestjs-prometheus prom-client"
docker-compose exec balance_service sh -c "cd /app && pnpm add @willsoto/nestjs-prometheus prom-client"
docker-compose exec games_service sh -c "cd /app && pnpm add @willsoto/nestjs-prometheus prom-client"
docker-compose exec gateway_service sh -c "cd /app && pnpm add @willsoto/nestjs-prometheus prom-client"
```

### 2. Оптимизация конфигурации NestJS для интеграции с Prometheus

Для корректной работы модуля метрик в NestJS необходимо:

1. Убедиться, что модуль `MetricsModule` правильно настроен и экспортирует контроллер для эндпоинта `/metrics`:

```typescript
// common/modules/metrics/metrics.module.ts
@Global()
@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
  providers: [MetricsService, MetricsInterceptor, ...metricProviders],
  exports: [MetricsService, MetricsInterceptor],
})
export class MetricsModule {}
```

2. Убедиться, что перехватчик `MetricsInterceptor` правильно настроен для сбора метрик HTTP-запросов:

```typescript
// В app.module.ts каждого микросервиса
providers: [
  {
    provide: APP_INTERCEPTOR,
    useClass: MetricsInterceptor,
  },
],
```

### 3. Проверка доступности эндпоинта /metrics

После внесения изменений необходимо проверить доступность эндпоинта `/metrics` в каждом микросервисе:

```bash
# Проверка внутри контейнера
docker-compose exec balance_service wget -qO- http://localhost:3000/metrics
docker-compose exec identity_service wget -qO- http://localhost:3000/metrics
docker-compose exec games_service wget -qO- http://localhost:3000/metrics
docker-compose exec gateway_service wget -qO- http://localhost:3000/metrics
```

### 4. Настройка интервалов сбора и агрегации метрик

Оптимизировать конфигурацию Prometheus для более эффективного сбора метрик:

```yaml
# startup/prometheus/prometheus.yml
global:
  scrape_interval: 15s     # Интервал сбора метрик
  evaluation_interval: 15s # Интервал вычисления правил
  scrape_timeout: 10s      # Таймаут сбора метрик

scrape_configs:
  - job_name: 'identity'
    metrics_path: '/metrics'
    scrape_interval: 10s   # Более частый сбор для важных сервисов
    static_configs:
      - targets: ['identity:3000']
```

### 5. Нагрузочное тестирование

После устранения проблем рекомендуется провести нагрузочное тестирование для проверки стабильности системы метрик:

```bash
# Пример использования Apache Benchmark для создания нагрузки
ab -n 1000 -c 10 http://localhost:3000/graphql
```

## Заключение

Интеграция Prometheus и Grafana в микросервисную архитектуру требует дополнительной настройки для полной работоспособности. Основные проблемы связаны с установкой зависимостей и настройкой экспорта метрик в микросервисах. После устранения этих проблем система мониторинга будет полностью функциональна.

Все изменения, связанные с интеграцией Prometheus и Grafana, зафиксированы в ветке `sky_net_prom`.
