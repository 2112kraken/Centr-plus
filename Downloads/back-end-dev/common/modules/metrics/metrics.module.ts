import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { Module, Global } from '@nestjs/common';

import { metricProviders } from './metrics.definitions';
import { MetricsInterceptor } from './metrics.interceptor';
import { MetricsService } from './metrics.service';

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
