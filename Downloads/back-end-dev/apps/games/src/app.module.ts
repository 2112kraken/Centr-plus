import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { GraphQLErrorFilter } from '@common/exception/graphql-error.filter';
import {
  AppConfig,
  PgConfig,
  ApolloFederationConfig,
  LoggerConfig,
  KafkaConfig,
  KafkaProducerConfig,
  BalanceClientConfig,
  JwtConfig,
  InfinConfig,
  IdentityClientConfig,
  CurrencyExchangeConfig,
} from '@common/modules/config/configs';
import { DefaultModule, HealthCheck } from '@common/modules/default.module';

import { GamesModule } from '@games/games.module';

@Module({
  imports: [
    GamesModule,
    DefaultModule.forRoot({
      rootDir: __dirname,
      healthCheck: [HealthCheck.DB],
      configs: [
        AppConfig,
        PgConfig,
        JwtConfig,
        InfinConfig,
        ApolloFederationConfig,
        LoggerConfig,
        KafkaConfig,
        KafkaProducerConfig,
        BalanceClientConfig,
        IdentityClientConfig,
        CurrencyExchangeConfig,
      ],
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
