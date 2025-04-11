import { AppModule } from '@psp/app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { TtLogger } from '@app/logger';

import { AppConfig } from '@common/modules/config/configs';

async function bootstrap() {
  initializeTransactionalContext();

  const fastifyAdapter = new FastifyAdapter({
    trustProxy: true,
    disableRequestLogging: true,
    forceCloseConnections: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter, { bufferLogs: true });

  const logger = app.get(TtLogger);
  app.useLogger(logger);

  const { name: appName, port: appPort } = app.get(AppConfig);

  await app.listen(appPort, '0.0.0.0', (err) => {
    if (err) {
      logger.error(`Failed to start server: ${err.message}`, 'Bootstrap');
      process.exit(1);
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
