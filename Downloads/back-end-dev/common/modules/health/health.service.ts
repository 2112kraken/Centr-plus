import { Injectable } from '@nestjs/common';
import { HealthIndicatorFunction, HealthIndicatorService, TypeOrmHealthIndicator } from '@nestjs/terminus';

import { TtLogger } from '@app/logger';

import { HealthCheck } from './health.interface';

@Injectable()
export class ServicesHealthIndicator {
  constructor(
    private readonly db: TypeOrmHealthIndicator,
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly logger: TtLogger,
    private readonly services: HealthCheck[] = [],
  ) {}

  async isHealthy(service: HealthCheck) {
    const indicator = this.healthIndicatorService.check(service);

    try {
      switch (service) {
        case HealthCheck.DB:
          await this.db.pingCheck('database');
          return indicator.up();
        case HealthCheck.KAFKA:
          // TODO: Replace with actual Kafka health check
          return indicator.up({ kafka: { status: 'up' } });
        case HealthCheck.REDIS:
          // TODO: Replace with actual Redis health check
          return indicator.up({ redis: { status: 'up' } });
        default:
          return indicator.down('Unknown service');
      }
    } catch (err) {
      this.logger.error({
        err: err as Error,
        msg: 'Error health checking service',
        data: { service },
      });

      return indicator.down(`Service ${service} is down`);
    }
  }

  getHealthIndicators(): HealthIndicatorFunction[] {
    return this.services.map((service) => () => this.isHealthy(service));
  }
}
