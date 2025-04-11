import { firstValueFrom } from 'rxjs';

import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { TtLogger } from '@app/logger';
import { getEventPatternFromDto } from '@app/nest-dto-rpc';

@Injectable()
export class ProducerService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly logger: TtLogger,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }

  async publish(payload: Record<string, any>): Promise<void> {
    const eventPattern = getEventPatternFromDto(payload.constructor);
    try {
      this.logger.debug({ data: { eventPattern, payload }, msg: 'Publishing message to Kafka' });
      await firstValueFrom(this.kafkaClient.emit(eventPattern, JSON.stringify(payload)));
    } catch (err: any) {
      throw new Error(`Failed to publish message to Kafka: ${err.message}`);
    }
  }
}
