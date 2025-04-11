import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { DtoRpcClient } from './dto-rpc.client';

export interface DtoRpcModuleOptions {
  client: ClientProxy;
  serviceName: string;
}

export interface DtoRpcModuleAsyncOptions {
  useFactory: (...args: any[]) => Promise<DtoRpcModuleOptions> | DtoRpcModuleOptions;
  inject?: Array<Type<any> | string | symbol>;
}

@Module({})
export class NestDtoRpcModule {
  /**
   * Register the DtoRpcModule with a configured ClientProxy and service name
   * @param options Configuration options including ClientProxy instance and service name
   * @returns Dynamic module configuration
   */
  static register(options: DtoRpcModuleOptions): DynamicModule {
    const clientProvider: Provider = {
      provide: DtoRpcClient,
      useFactory: () => {
        return new DtoRpcClient(options.client, options.serviceName);
      },
    };

    return {
      module: NestDtoRpcModule,
      providers: [clientProvider],
      exports: [DtoRpcClient],
    };
  }

  /**
   * Register the DtoRpcModule asynchronously
   * @param options Async configuration options
   * @returns Dynamic module configuration
   */
  static registerAsync(options: DtoRpcModuleAsyncOptions): DynamicModule {
    const clientProvider: Provider = {
      provide: DtoRpcClient,
      useFactory: async (...args: any[]) => {
        const config = await options.useFactory(...args);
        return new DtoRpcClient(config.client, config.serviceName);
      },
      inject: options.inject || [],
    };

    return {
      module: NestDtoRpcModule,
      providers: [clientProvider],
      exports: [DtoRpcClient],
    };
  }
}
