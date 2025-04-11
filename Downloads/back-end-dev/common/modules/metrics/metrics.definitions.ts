import { makeCounterProvider, makeGaugeProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

/**
 * Счетчик HTTP-запросов
 */
export const httpRequestsCounterProvider = makeCounterProvider({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'statusCode'],
});

/**
 * Гистограмма длительности HTTP-запросов
 */
export const httpRequestDurationProvider = makeHistogramProvider({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
});

/**
 * Информация о приложении
 */
export const appInfoGaugeProvider = makeGaugeProvider({
  name: 'app_info',
  help: 'Application information',
  labelNames: ['version'],
});

/**
 * Все провайдеры метрик
 */
export const metricProviders = [httpRequestsCounterProvider, httpRequestDurationProvider, appInfoGaugeProvider];
