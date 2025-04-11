import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = this.getRequest(context);
    const method = request.method || 'unknown';
    const route = this.getRoute(context, request);

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = (Date.now() - startTime) / 1000; // в секундах
          const statusCode = context.switchToHttp().getResponse()?.statusCode || 200;

          this.metricsService.incrementHttpRequests(method, route, statusCode);
          this.metricsService.observeHttpRequestDuration(method, route, duration);
        },
        error: (error) => {
          const duration = (Date.now() - startTime) / 1000; // в секундах
          const statusCode = error.status || 500;

          this.metricsService.incrementHttpRequests(method, route, statusCode);
          this.metricsService.observeHttpRequestDuration(method, route, duration);
        },
      }),
    );
  }

  private getRequest(context: ExecutionContext): any {
    // Проверяем, является ли контекст GraphQL
    if (context.getType<string>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      return gqlContext.getContext().req;
    }

    // Для HTTP запросов
    return context.switchToHttp().getRequest();
  }

  private getRoute(context: ExecutionContext, request: any): string {
    // Для GraphQL запросов
    if (context.getType<string>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const info = gqlContext.getInfo();
      return `graphql:${info.parentType.name}.${info.fieldName}`;
    }

    // Для HTTP запросов
    return request.route?.path || request.url || 'unknown';
  }
}
