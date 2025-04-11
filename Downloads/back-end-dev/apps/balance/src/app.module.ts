import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { GraphQLErrorFilter } from '@common/exception/graphql-error.filter';
import {
  AppConfig,
  PgConfig,
  ApolloFederationConfig,
  LoggerConfig,
  KafkaConfig,
  KafkaProducerConfig,
  CurrencyExchangeConfig,
} from '@common/modules/config/configs';
import { DefaultModule, HealthCheck } from '@common/modules/default.module';
import { MetricsModule, MetricsInterceptor } from '@common/modules/metrics';

import { BalanceModule } from '@balance/balance.module';

@Module({
  imports: [
    BalanceModule,
    MetricsModule,
    DefaultModule.forRoot({
      rootDir: __dirname,
      healthCheck: [HealthCheck.DB],
      configs: [
        AppConfig,
        PgConfig,
        ApolloFederationConfig,
        LoggerConfig,
        KafkaConfig,
        KafkaProducerConfig,
        CurrencyExchangeConfig,
      ],
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GraphQLErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
})
export class AppModule {}
