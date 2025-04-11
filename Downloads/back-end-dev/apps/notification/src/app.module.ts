import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { GraphQLErrorFilter } from '@common/exception/graphql-error.filter';
import { AppConfig, LoggerConfig } from '@common/modules/config/configs';
import { DefaultModule } from '@common/modules/default.module';

import { NotificationModule } from './notification.module';

@Module({
  imports: [
    NotificationModule,
    DefaultModule.forRoot({
      rootDir: __dirname,
      configs: [AppConfig, LoggerConfig],
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
