import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { GraphQLErrorFilter } from '@common/exception/graphql-error.filter';
import {
  AppConfig,
  PgConfig,
  ApolloFederationConfig,
  LoggerConfig,
  JwtConfig,
  PasswordConfig,
  RedisCacheConfig,
  I18nConfig,
  KafkaConfig,
  KafkaProducerConfig,
} from '@common/modules/config/configs';
import { DefaultModule, HealthCheck } from '@common/modules/default.module';
import { MetricsModule, MetricsInterceptor } from '@common/modules/metrics';

import { IdentityModule } from '@identity/modules/identity.module';

@Module({
  imports: [
    CqrsModule.forRoot(),
    IdentityModule,
    MetricsModule,
    DefaultModule.forRoot({
      rootDir: __dirname,
      healthCheck: [HealthCheck.DB],
      configs: [
        AppConfig,
        PgConfig,
        ApolloFederationConfig,
        LoggerConfig,
        JwtConfig,
        PasswordConfig,
        RedisCacheConfig,
        I18nConfig,
        KafkaConfig,
        KafkaProducerConfig,
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
