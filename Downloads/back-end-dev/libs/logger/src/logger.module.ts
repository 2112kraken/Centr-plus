import { AsyncLocalStorage } from 'async_hooks';

import { DynamicModule, Module } from '@nestjs/common';

import { TtLogger } from '@app/logger/logger.service';

export interface LogContext {
  userId?: string;
  traceId?: string;
}

export const loggerStorage = new AsyncLocalStorage<LogContext>();

export interface ILoggerConfig {
  level?: string;
  pretty?: boolean;
  serviceName?: string;
}

export type LoggerConfigFactory = (...args: any[]) => Promise<ILoggerConfig> | ILoggerConfig;

interface LoggerModuleOptions {
  useFactory: LoggerConfigFactory;
  inject?: any[];
}

@Module({})
export class LoggerModule {
  static forRootAsync(options: LoggerModuleOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: TtLogger,
          useFactory: async (...args: any[]) => {
            const config = await options.useFactory(...args);
            return new TtLogger(config, loggerStorage);
          },
          inject: options.inject || [],
        },
      ],
      exports: [TtLogger],
      global: true,
    };
  }
}
