import { DynamicModule } from '@nestjs/common';
import { TerminusModule, TypeOrmHealthIndicator, HealthIndicatorService } from '@nestjs/terminus';

import { TtLogger } from '@app/logger';

import { HealthController } from '@common/modules/health/health.controller';
import { HealthModuleOptions } from '@common/modules/health/health.interface';
import { ServicesHealthIndicator } from '@common/modules/health/health.service';

export class HealthModule {
  static forRoot(options: HealthModuleOptions): DynamicModule {
    return {
      module: HealthModule,
      imports: [TerminusModule],
      controllers: [HealthController],
      providers: [
        {
          provide: ServicesHealthIndicator,
          inject: [TypeOrmHealthIndicator, HealthIndicatorService, TtLogger],
          useFactory: (db: TypeOrmHealthIndicator, healthIndicatorService: HealthIndicatorService, logger: TtLogger) =>
            new ServicesHealthIndicator(db, healthIndicatorService, logger, options.healthCheck),
        },
      ],
      exports: [ServicesHealthIndicator],
    };
  }
}
