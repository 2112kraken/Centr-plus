import { Keyv, createKeyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { GraphQLFormattedError } from 'graphql';
import { I18nModule, AcceptLanguageResolver, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { ApolloFederationDriverConfig, ApolloFederationDriver, ApolloDriver } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { Module, DynamicModule, Type } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerModule } from '@app/logger';

import { BaseConfig } from '@common/modules/config/base-config';
import { ConfigModule } from '@common/modules/config/config.module';
import {
  LoggerConfig,
  PgConfig,
  ApolloFederationConfig,
  I18nConfig,
  RedisCacheConfig,
  KafkaConfig,
  KafkaProducerConfig,
  IdentityClientConfig,
  JwtConfig,
  PasswordConfig,
  ApolloConfig,
  BalanceClientConfig,
} from '@common/modules/config/configs';
import { EventBusModule } from '@common/modules/event-bus/event-bus.module';
import { RpcClient } from '@common/modules/rpc/service-name.enum';
import { TokenModule } from '@common/modules/security/jwt/token.module';
import { PasswordModule } from '@common/modules/security/password/password.module';

import { HealthCheck } from './health/health.interface';
import { HealthModule } from './health/health.module';

/**
 * @example
 * DefaultModule.forRoot({
 *   configs: [ApolloConfig, PgConfig, LoggerConfig],
 * });
 */
export { HealthModule } from './health/health.module';
export { HealthCheck } from './health/health.interface';

@Module({})
export class DefaultModule {
  /**
   * Dynamically imports and configures modules based on provided config classes.
   */
  public static forRoot<TConfig extends Type<BaseConfig>>(options: {
    configs: TConfig[];
    rootDir: string;
    healthCheck?: HealthCheck[];
  }): DynamicModule {
    const { configs, healthCheck = [], rootDir } = options;

    // Build an array of common imports:
    const imports: (DynamicModule | Type<any>)[] = [
      // Health check module
      HealthModule.forRoot({ healthCheck }),
      // 1. ConfigModule (global config load & validation)
      ConfigModule.forRoot({
        configs,
        enlivenments: [
          { env: 'local', load: '.env.local' },
          { env: 'dev', ignoreEnvFile: true },
          { env: 'prod', ignoreEnvFile: true },
        ],
        validate: true,
      }),
      // 2. Possible dynamic modules from each config
      ...configs
        .map((configClass) => this.mapConfigToModule(rootDir, configClass))
        .filter((m): m is DynamicModule => m != null),
    ];

    return {
      module: DefaultModule,
      imports,
      exports: imports,
    };
  }

  /**
   * Converts a config class into its corresponding NestJS module(s).
   */
  private static mapConfigToModule(rootDir: string, Config: unknown): DynamicModule | Type<any> | null {
    // Logger
    if (Config === LoggerConfig) {
      return LoggerModule.forRootAsync({
        inject: [LoggerConfig],
        useFactory: (cfg: LoggerConfig) => ({
          level: cfg.level,
        }),
      });
    }

    // Postgres
    if (Config === PgConfig) {
      return TypeOrmModule.forRootAsync({
        inject: [PgConfig],
        useFactory: (cfg: PgConfig) => ({
          ...cfg,
          entities: [rootDir + '/**/*.entity{.ts,.js}'],
          bigNumberStrings: true,
        }),
        async dataSourceFactory(options) {
          if (!options) {
            throw new Error('Invalid TypeORM options passed');
          }
          // enable transactional data source
          return addTransactionalDataSource(new DataSource(options));
        },
      });
    }

    // Apollo GraphQL
    if (Config === ApolloFederationConfig) {
      return GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
        driver: ApolloFederationDriver,
        inject: [ApolloFederationConfig],
        useFactory: async (cfg: ApolloFederationConfig) => ({
          ...cfg,
          formatError: (error): GraphQLFormattedError => {
            return {
              message: error.message,
              extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
                detail: error.extensions?.detail,
              },
            };
          },
        }),
      });
    }

    if (Config === ApolloConfig) {
      return GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
        driver: ApolloDriver,
        inject: [ApolloConfig],
        useFactory: async (cfg: ApolloConfig) => ({
          ...cfg,
          csrfPrevention: cfg.csrfPrevention,
          cors: {
            origin: '*',
            credentials: true,
            allowedHeaders: [
              'Content-Type',
              'Accept',
              'Authorization',
              'X-Apollo-Operation-Name',
              'Apollo-Require-Preflight',
            ],
          },
          formatError: (error): GraphQLFormattedError => {
            return {
              message: error.message,
              extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
                detail: error.extensions?.detail,
              },
            };
          },
        }),
      });
    }

    if (Config === I18nConfig) {
      return I18nModule.forRoot({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: join(rootDir, '../i18n/'),
          watch: true,
        },
        resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
      });
    }

    if (Config === RedisCacheConfig) {
      return CacheModule.registerAsync({
        isGlobal: true,
        useFactory: async (config: RedisCacheConfig) => {
          return {
            stores: [
              new Keyv({
                store: new CacheableMemory(),
              }),
              createKeyv(config.url),
            ],
          };
        },
        inject: [RedisCacheConfig],
      });
    }

    if (Config === KafkaConfig || Config === KafkaProducerConfig) {
      return EventBusModule;
    }

    if (Config === IdentityClientConfig) {
      return ClientsModule.registerAsync({
        isGlobal: true,
        clients: [
          {
            name: RpcClient.IDENTITY,
            inject: [IdentityClientConfig],
            useFactory: (config: IdentityClientConfig) => ({
              transport: Transport.TCP,
              options: {
                port: config.port,
                host: config.host,
              },
            }),
          },
        ],
      });
    }

    if (Config === BalanceClientConfig) {
      return ClientsModule.registerAsync({
        isGlobal: true,
        clients: [
          {
            name: RpcClient.BALANCE,
            inject: [BalanceClientConfig],
            useFactory: (config: BalanceClientConfig) => ({
              transport: Transport.TCP,
              options: {
                port: config.port,
                host: config.host,
              },
            }),
          },
        ],
      });
    }

    if (Config === JwtConfig) {
      return TokenModule;
    }

    if (Config === PasswordConfig) {
      return PasswordModule;
    }

    // If no matching config -> return null
    return null;
  }
}
