import { XMLParser } from 'fast-xml-parser';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { TtLogger } from '@app/logger';

import { AppConfig, KafkaConfig } from '@common/modules/config/configs';

import { AppModule } from '@games/app.module';

async function bootstrap() {
  const xmlParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@',
  });

  initializeTransactionalContext();

  const fastifyAdapter = new FastifyAdapter({
    trustProxy: true,
    disableRequestLogging: true,
    forceCloseConnections: true,
  });

  fastifyAdapter.getInstance().addContentTypeParser('application/xml', { parseAs: 'string' }, (req, body, done) => {
    try {
      const parsed = xmlParser.parse(body);
      done(null, parsed);
    } catch (err) {
      if (err instanceof Error) {
        done(err);
      }
    }
  });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter, { bufferLogs: true });

  const kafkaConfig = app.get<KafkaConfig>(KafkaConfig);

  // Kafka transport
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: kafkaConfig.brokers,
        clientId: kafkaConfig.clientId,
      },
      consumer: {
        groupId: kafkaConfig.groupId,
      },
    },
  });

  const logger = app.get(TtLogger);
  app.useLogger(logger);

  const { name: appName, port: appPort } = app.get(AppConfig);

  await app.startAllMicroservices();
  await app.listen(appPort, '0.0.0.0', (err) => {
    if (err) {
      logger.error(`Failed to start server: ${err.message}`, 'Bootstrap');
      app.close().finally(() => process.exit(1));
    }

    logger.log({
      msg: `${appName} app listening`,
      data: {
        health: `http://localhost:${appPort}/health`,
        graphql: `http://localhost:${appPort}/graphql`,
      },
    });
  });
}

bootstrap();
