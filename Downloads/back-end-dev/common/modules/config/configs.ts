import { ServiceEndpointDefinition } from '@apollo/gateway';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsString,
  IsNumber,
  ValidateNested,
  IsEnum,
  MinLength,
  IsUrl,
  IsOptional,
  Length,
} from 'class-validator';

import { ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { AutoSchemaFileValue } from '@nestjs/graphql';

import { BaseConfig } from '@common/modules/config/base-config';
import { CurrencyExchangeStrategy } from '@common/modules/currency-exchange/currency-exchange-strategy.enum';

@Injectable()
export class PgConfig extends BaseConfig {
  @IsString()
  @IsNotEmpty()
  type = 'postgres' as const;

  @IsString()
  @IsNotEmpty()
  host = this.asString('PG_HOST');

  @IsInt()
  port = this.asNumber('PG_PORT', 5432);

  @IsString()
  @IsNotEmpty()
  username = this.asString('PG_USERNAME');

  @IsString()
  @IsNotEmpty()
  password = this.asString('PG_PASSWORD');

  @IsString()
  @IsNotEmpty()
  database = this.asString('PG_DATABASE');

  @IsBoolean()
  synchronize = this.asBoolean('PG_SYNCHRONIZE', false);

  @IsBoolean()
  logging = this.asBoolean('PG_LOGGING');
}

@Injectable()
export class AppConfig extends BaseConfig {
  @IsString()
  name = this.asStringOrThrow('APP_NAME');

  @IsInt()
  @IsPositive()
  port = this.asNumber('APP_PORT', 3000);

  @IsInt()
  @IsPositive()
  @IsOptional()
  tcpPort = this.asNumber('APP_TCP_PORT', 5000);
}

@Injectable()
export class LoggerConfig extends BaseConfig {
  @IsString()
  @IsNotEmpty()
  level = this.asString('LOG_LEVEL', 'debug');

  @IsString()
  @IsNotEmpty()
  format = this.asString('LOG_FORMAT', 'json');
}

export class JwtTokenConfig {
  @IsString()
  secret: string;

  @IsNumber()
  ttlMs: number;
}

@Injectable()
export class JwtConfig extends BaseConfig {
  @ValidateNested()
  @Type(() => JwtTokenConfig)
  get access() {
    return {
      secret: this.asStringOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.asNumber('JWT_ACCESS_TOKEN_MS_LLT', 900000) / 1000, // 15 mins
    };
  }

  @ValidateNested()
  @Type(() => JwtTokenConfig)
  get refresh() {
    return {
      secret: this.asStringOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.asNumber('JWT_REFRESH_TOKEN_MS_LLT', 604800000) / 1000, // 15 mins
    };
  }
}

export enum PasswordAlgorithm {
  SHA256 = 'sha256',
  SHA512 = 'sha512',
}

@Injectable()
export class PasswordConfig extends BaseConfig {
  @IsEnum(PasswordAlgorithm)
  algorithm = this.asStringOrThrow<PasswordAlgorithm>('PASSWORD_HMAC_ALGORITHM');

  @IsString()
  @MinLength(32)
  salt = this.asStringOrThrow('PASSWORD_SALT');
}

@Injectable()
export class ApolloFederationConfig extends BaseConfig implements ApolloFederationDriverConfig {
  playground = this.asBoolean('APOLLO_PLAYGROUND', true);
  introspection = this.asBoolean('APOLLO_INTROSPECTION', true);
  csrfPrevention = this.asBoolean('APOLLO_CSRF_PREVENTION', false);
  autoSchemaFile: AutoSchemaFileValue = {
    federation: 2,
  };
}

@Injectable()
export class ApolloConfig extends BaseConfig implements ApolloFederationDriverConfig {
  playground = this.asBoolean('APOLLO_PLAYGROUND', true);
  introspection = this.asBoolean('APOLLO_INTROSPECTION', true);
  csrfPrevention = this.asBoolean('APOLLO_CSRF_PREVENTION', false);
  autoSchemaFile: AutoSchemaFileValue = {
    federation: 2,
  };
}

export class SubgraphsConfig implements ServiceEndpointDefinition {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  url: string;
}

@Injectable()
export class FederationConfig extends BaseConfig {
  @ValidateNested({ each: true })
  @Type(() => SubgraphsConfig)
  subgraphs = this.asJson<SubgraphsConfig[]>('APOLLO_SERVICES', []);
  csrfPrevention = this.asBoolean('APOLLO_CSRF_PREVENTION', false);
}

export class I18nConfig extends BaseConfig {
  @IsString()
  @IsNotEmpty()
  @Length(2)
  @IsOptional()
  fallbackLanguage = this.asString('I18N_FALLBACK_LANGUAGE', 'en');

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  languageHeader = this.asString('I18N_LANGUAGE_HEADER', 'x-language');
}

@Injectable()
export class RedisCacheConfig extends BaseConfig {
  @IsString()
  url = this.asString('REDIS_URL', 'redis://localhost:6379/0');
}

@Injectable()
export class KafkaConfig extends BaseConfig {
  @IsString({ each: true })
  brokers = this.asStringOrThrow('KAFKA_BROKERS').split(',');

  @IsString()
  clientId = this.asStringOrThrow('KAFKA_CLIENT_ID');

  @IsString()
  groupId = this.asStringOrThrow('KAFKA_GROUP_ID');

  constructor() {
    super();
  }
}

@Injectable()
export class KafkaProducerConfig extends BaseConfig {
  @IsString()
  @IsNotEmpty()
  topic = this.asString('KAFKA_PRODUCER_TOPIC', 'events');

  @IsBoolean()
  @IsOptional()
  enableIdempotence = this.asBoolean('KAFKA_PRODUCER_IDEMPOTENCE', true);

  @IsNumber()
  @IsOptional()
  messageTimeout = this.asNumber('KAFKA_PRODUCER_MESSAGE_TIMEOUT', 30000);

  @IsNumber()
  @IsOptional()
  retries = this.asNumber('KAFKA_PRODUCER_RETRIES', 3);
}

export class IdentityClientConfig extends BaseConfig {
  @IsString({ each: true })
  host = this.asStringOrThrow('IDENTITY_HOST');

  @IsPositive()
  @IsInt()
  port = this.asNumberOrThrow('IDENTITY_TCP_PORT');
}

export class BalanceClientConfig extends BaseConfig {
  @IsString({ each: true })
  host = this.asStringOrThrow('BALANCE_HOST');

  @IsPositive()
  @IsInt()
  port = this.asNumberOrThrow('BALANCE_TCP_PORT');
}

@Injectable()
export class InfinConfig extends BaseConfig {
  launchUrlHost = this.asString('INFIN_LAUNCH_HOST');
}

@Injectable()
export class CurrencyExchangeConfig extends BaseConfig {
  @IsEnum(CurrencyExchangeStrategy)
  strategy = this.asString('CURRENCY_EXCHANGE_STRATEGY') as CurrencyExchangeStrategy;
}

@Injectable()
export class OpenTelemetryConfig extends BaseConfig {
  grpcUrl = this.asString('OTEL_COLLECTOR_GRPC_URL', 'grpc://localhost:4317');
}
