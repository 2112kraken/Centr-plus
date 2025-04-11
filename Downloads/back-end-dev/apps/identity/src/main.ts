import { initializeTransactionalContext } from 'typeorm-transactional';

import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { TtLogger } from '@app/logger';

import { AppConfig } from '@common/modules/config/configs';
import { RpcUserExceptionFilter } from '@common/modules/rpc/rpc-error.pipe';

import { AppModule } from '@identity/app.module';

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

  const { name: appName, port: appPort, tcpPort: appTcpPort } = app.get(AppConfig);

  if (appTcpPort) {
    const microservice = app.connectMicroservice({
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: appTcpPort,
      },
    });

    microservice.useGlobalFilters(new RpcUserExceptionFilter(logger));
  }

  await app.startAllMicroservices();

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
        tcp: `tcp://localhost:${appTcpPort}`,
      },
    });
  });
}

bootstrap();
