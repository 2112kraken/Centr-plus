import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { GraphQLErrorFilter } from '@common/exception/graphql-error.filter';
import { AppConfig, PgConfig, LoggerConfig, IdentityClientConfig, ApolloConfig } from '@common/modules/config/configs';
import { DefaultModule, HealthCheck } from '@common/modules/default.module';

import { AdminpanelModule } from '@adminpanel/admin.module';

@Module({
  imports: [
    AdminpanelModule,
    DefaultModule.forRoot({
      rootDir: __dirname,
      healthCheck: [HealthCheck.DB],
      configs: [AppConfig, PgConfig, ApolloConfig, LoggerConfig, IdentityClientConfig],
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
