import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { TtLogger } from '@app/logger';

import { AppConfig } from '@common/modules/config/configs';

import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({
    logger: false,
    disableRequestLogging: true,
    bodyLimit: 1024 * 1024 * 10,
  });

  const app = await NestFactory.create<NestFastifyApplication>(GatewayModule, fastifyAdapter, { bufferLogs: true });

  const { port: appPort } = app.get(AppConfig);
  const logger = app.get(TtLogger);

  app.useLogger(logger);

  app.enableCors({
    origin: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(appPort, '0.0.0.0', () => {
    logger.log(`Gateway is running on: http://localhost:${appPort}/graphql`);
  });
}

bootstrap();
