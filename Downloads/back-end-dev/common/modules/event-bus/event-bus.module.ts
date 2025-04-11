import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { KafkaConfig, KafkaProducerConfig } from '@common/modules/config/configs';
import { ProducerService } from '@common/modules/event-bus/producer.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        useFactory: (kafkaConfig: KafkaConfig, producerConfig: KafkaProducerConfig) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: kafkaConfig.clientId,
              brokers: kafkaConfig.brokers,
            },
            producer: {
              idempotent: producerConfig.enableIdempotence,
              messageTimeout: producerConfig.messageTimeout,
              retries: producerConfig.retries,
            },
            createTopics: true, // Enable auto-creation of topics
            topic: {
              partitions: 3,
              replicationFactor: 2,
            },
          },
        }),
        inject: [KafkaConfig, KafkaProducerConfig],
      },
    ]),
  ],
  providers: [ProducerService],
  exports: [ProducerService],
})
export class EventBusModule {}
