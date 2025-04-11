import { ClassConstructor } from 'class-transformer';
import { validateSync } from 'class-validator';
import { parse as parseEnv } from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import { DynamicModule, Global, Module } from '@nestjs/common';

interface EnvConfig {
  env: string;
  load?: string;
  ignoreEnvFile?: boolean;
}

interface ConfigModuleOptions {
  enlivenments: EnvConfig[];
  configs: ClassConstructor<object>[];
  validate?: boolean;
}

@Global()
@Module({})
export class ConfigModule {
  static forRoot(options: ConfigModuleOptions): DynamicModule {
    const providers = this.createProviders(options);

    return {
      module: ConfigModule,
      providers,
      exports: providers,
      global: true,
    };
  }

  private static createProviders(options: ConfigModuleOptions) {
    this.loadEnvFile(options.enlivenments);

    return options.configs.map((ConfigClass) => ({
      provide: ConfigClass,
      useFactory: () => {
        const config = new ConfigClass();

        if (options.validate) {
          const errors = validateSync(config);
          if (errors.length > 0) {
            throw new Error(
              `Configuration validation failed: ${errors
                .map((error) => Object.values(error.constraints || {}))
                .join('\n')}`,
            );
          }
        }

        return config;
      },
    }));
  }

  private static loadEnvFile(envConfigs: EnvConfig[]) {
    const nodeEnv = process.env.NODE_ENV;
    const appName = process.env.APP_NAME;

    if (!nodeEnv) {
      throw new Error('Env "NODE_ENV" is required to start.');
    }

    if (!appName) {
      throw new Error('Env "APP_NAME" is required to start.');
    }

    const envConfig = envConfigs.find((config) => config.env === nodeEnv);

    if (!envConfig || envConfig.ignoreEnvFile) {
      return;
    }

    const envPath = resolve(process.cwd(), 'apps', appName, envConfig.load || '.env');

    if (!existsSync(envPath)) {
      throw new Error(`Environment file ${envPath} not found`);
    }

    const envFile = parseEnv(readFileSync(envPath));

    for (const key in envFile) {
      if (!process.env[key]) {
        process.env[key] = envFile[key];
      }
    }
  }
}
