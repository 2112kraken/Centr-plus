import { SchedulerModule } from '@scheduler/scheduler.module';

import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { GraphQLErrorFilter } from '@common/exception/graphql-error.filter';
import { AppConfig, PgConfig, ApolloFederationConfig, LoggerConfig } from '@common/modules/config/configs';
import { DefaultModule, HealthCheck } from '@common/modules/default.module';

@Module({
  imports: [
    SchedulerModule,
    DefaultModule.forRoot({
      rootDir: __dirname,
      healthCheck: [HealthCheck.DB],
      configs: [AppConfig, PgConfig, ApolloFederationConfig, LoggerConfig],
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GraphQLErrorFilter,
    },
  ],
})
export class AppModule {}
