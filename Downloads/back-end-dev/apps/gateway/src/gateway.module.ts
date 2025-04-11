import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { FastifyRequest } from 'fastify';

import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';

import { TtLogger } from '@app/logger';

import { GraphQLErrorFilter } from '@common/exception/graphql-error.filter';
import { LoggerConfig, AppConfig, FederationConfig } from '@common/modules/config/configs';
import { DefaultModule } from '@common/modules/default.module';

interface Context {
  req: FastifyRequest;
}

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: GraphQLErrorFilter,
    },
  ],
  imports: [
    DefaultModule.forRoot({
      configs: [LoggerConfig, AppConfig, FederationConfig],
      rootDir: __dirname,
    }),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      inject: [FederationConfig, TtLogger],
      useFactory: (cfg: FederationConfig, logger: TtLogger) => ({
        server: {
          context: ({ req }: Context): Context => ({ req }),
        },
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: cfg.subgraphs,
          }),
          buildService: ({ url }) => {
            return new RemoteGraphQLDataSource({
              url,
              willSendRequest({ request, context }) {
                const allowedHeaders = ['authorization'];
                logger.debug({
                  data: {
                    url,
                    allowedHeaders,
                    headers: context.req?.headers,
                    method: context.req?.method,
                  },
                });

                allowedHeaders.forEach((headerName) => {
                  const headerValue = context.req?.headers[headerName];

                  if (request.http && headerValue) {
                    request.http.headers.set(headerName, headerValue);
                  }
                });
              },
            });
          },
        },
      }),
    }),
  ],
})
export class GatewayModule {}
