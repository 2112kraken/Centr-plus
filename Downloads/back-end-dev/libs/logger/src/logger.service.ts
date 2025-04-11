import { AsyncLocalStorage } from 'async_hooks';
import pino from 'pino';

import { Injectable, LoggerService as ILoggerService, LogLevel } from '@nestjs/common';

import { LogContext, ILoggerConfig } from './logger.module';

interface LogPayload {
  place?: string;
  msg?: string;
  data?: Record<string, any>;
}

interface ErrorLogPayload extends LogPayload {
  err: Error;
}

@Injectable()
export class TtLogger implements ILoggerService {
  private readonly logger: pino.Logger;
  private readonly config: ILoggerConfig;
  private readonly storage?: AsyncLocalStorage<LogContext>;

  constructor(config: ILoggerConfig = {}, storage?: AsyncLocalStorage<LogContext>) {
    this.config = config;
    this.storage = storage;

    const options: pino.LoggerOptions = {
      level: config.level || 'info',
      timestamp: true,
    };

    if (config.pretty) {
      options.transport = {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: true,
        },
      };
    }

    if (config.serviceName) {
      options.base = {
        service: config.serviceName,
      };
    }

    this.logger = pino(options);
  }

  log(payload: LogPayload): void;
  log(message: string, ...optionalParams: any[]): void;
  log(logPayload: string | LogPayload, ...optionalParams: any[]): void {
    this.logMessage('info', logPayload, optionalParams);
  }

  error(payload: ErrorLogPayload): void;
  error(message: string, ...optionalParams: any[]): void;
  error(logPayload: string | ErrorLogPayload, ...optionalParams: any[]): void {
    this.logMessage('error', logPayload, optionalParams);
  }

  warn(payload: LogPayload): void;
  warn(message: string, ...optionalParams: any[]): void;
  warn(logPayload: string | LogPayload, ...optionalParams: any[]): void {
    this.logMessage('warn', logPayload, optionalParams);
  }

  debug(payload: LogPayload): void;
  debug(message: string, ...optionalParams: any[]): void;
  debug(logPayload: string | LogPayload, ...optionalParams: any[]): void {
    this.logMessage('debug', logPayload, optionalParams);
  }

  verbose(payload: LogPayload): void;
  verbose(message: string, ...optionalParams: any[]): void;
  verbose(logPayload: string | LogPayload, ...optionalParams: any[]): void {
    this.logMessage('trace', logPayload, optionalParams);
  }

  setLogLevels(levels: LogLevel[]) {
    const pinoLevel = this.mapNestLogLevelToPino(levels[0]);
    this.logger.level = pinoLevel;
  }

  get localInstance(): TtLogger {
    return new TtLogger(this.config, this.storage);
  }

  private mapNestLogLevelToPino(level: LogLevel): string {
    switch (level) {
      case 'debug':
        return 'debug';
      case 'verbose':
        return 'trace';
      case 'warn':
        return 'warn';
      case 'error':
        return 'error';
      case 'log':
      default:
        return 'info';
    }
  }

  private logMessage<T extends LogPayload>(
    level: keyof pino.Logger,
    messageOrPayload: string | T,
    optionalParams: any[] = [],
  ): void {
    const logFn = this.logger[level] as (obj: object, msg?: string) => void;
    const context = this.storage?.getStore();

    if (typeof messageOrPayload === 'string') {
      logFn.call(
        this.logger,
        {
          context: optionalParams,
          place: this.getCallSite(),
          userId: context?.userId,
          traceId: context?.traceId,
        },
        messageOrPayload,
      );
      return;
    }

    logFn.call(this.logger, {
      ...messageOrPayload,
      place: messageOrPayload.place || this.getCallSite(),
      userId: context?.userId,
      traceId: context?.traceId,
    });
  }

  /**
   * Input example:
   * Error
   *     at LoggerService.getCallSite (/app/src/logger.service.ts:42:19)
   *     at LoggerService.log (/app/src/logger.service.ts:35:26)
   *     at UserService.createUser (/app/src/user.service.ts:15:12)
   *
   * Output example: user.service.ts:15:12
   */
  private getCallSite(): string | undefined {
    const error = new Error();
    const stack = error.stack;

    if (!stack) {
      return undefined;
    }

    const frames = stack.split('\n').slice(3);

    for (const frame of frames) {
      if (frame.includes('LoggerService') || frame.includes('logger.service')) continue;

      const match = frame.match(/(?:at\s+.*\s+\()?(?:file:\/\/\/|webpack-internal:\/\/\/|\/)?([^:]+):(\d+):(\d+)/);
      if (!match) continue;

      const [, file, line, col] = match;
      const fileName = file.split('/').pop() || 'unknown';
      return `${fileName}:${line}:${col}`;
    }

    return undefined;
  }
}
