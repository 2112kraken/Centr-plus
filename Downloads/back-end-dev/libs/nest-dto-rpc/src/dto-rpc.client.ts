import { firstValueFrom } from 'rxjs';

import { ClientProxy } from '@nestjs/microservices';

import { MESSAGE_PATTERN_METADATA } from './decorators';

export class DtoRpcClient {
  constructor(
    private readonly client: ClientProxy,
    private readonly serviceName: string,
  ) {}

  /**
   * Send a message using a DTO instance
   * The message pattern is automatically generated from the DTO class name
   * @param dto The DTO instance to send
   * @returns Promise with the response
   */
  async execute<TInput extends object, TOutput = unknown>(dto: TInput): Promise<TOutput> {
    const dtoClass = dto.constructor as { new (...args: any[]): TInput };
    const customPattern = Reflect.getMetadata(MESSAGE_PATTERN_METADATA, dtoClass);
    const pattern = customPattern || `${this.serviceName}.${dtoClass.name}`;

    return firstValueFrom(this.client.send<TOutput, TInput>(pattern, dto));
  }

  /**
   * Send a message using a DTO instance without waiting for response
   * @param dto The DTO instance to emit
   */
  emit<TInput extends object>(dto: TInput): void {
    const dtoClass = dto.constructor as { new (...args: any[]): TInput };
    const customPattern = Reflect.getMetadata(MESSAGE_PATTERN_METADATA, dtoClass);
    const pattern = customPattern || `${this.serviceName}.${dtoClass.name}`;

    this.client.emit<void, TInput>(pattern, dto);
  }
}
