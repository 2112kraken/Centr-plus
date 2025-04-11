import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Gauge, Histogram } from 'prom-client';

import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly httpRequestsCounter: Counter<string>,
    @InjectMetric('http_request_duration_seconds')
    private readonly httpRequestDuration: Histogram<string>,
    @InjectMetric('app_info')
    private readonly appInfoGauge: Gauge<string>,
  ) {
    // Установка информации о приложении
    this.appInfoGauge.set({ version: process.env.npm_package_version || 'unknown' }, 1);
  }

  /**
   * Увеличивает счетчик HTTP-запросов
   * @param method HTTP метод
   * @param route Маршрут
   * @param statusCode Код ответа
   */
  incrementHttpRequests(method: string, route: string, statusCode: number): void {
    this.httpRequestsCounter.inc({ method, route, statusCode: statusCode.toString() });
  }

  /**
   * Записывает длительность HTTP-запроса
   * @param method HTTP метод
   * @param route Маршрут
   * @param duration Длительность в секундах
   */
  observeHttpRequestDuration(method: string, route: string, duration: number): void {
    this.httpRequestDuration.observe({ method, route }, duration);
  }
}
