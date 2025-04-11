import { GraphQLError } from 'graphql';

import { Catch, ArgumentsHost } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';

import { TtLogger } from '@app/logger';

@Catch()
export class GraphQLErrorFilter implements GqlExceptionFilter {
  constructor(private readonly logger: TtLogger) {}

  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const context = gqlHost.getContext();
    const info = gqlHost.getInfo();

    // Log the full error details
    this.logger.error({
      err: exception,
      msg: 'GraphQL error caught.',
      data: {
        path: info?.path?.key,
        operation: info?.operation?.name?.value,
        variables: context?.req?.body?.variables,
        query: context?.req?.body?.query,
      },
    });

    // If it's already a GraphQLError, return it
    if (exception instanceof GraphQLError) {
      return exception;
    }

    // Format error message
    const message = exception.message || 'Internal server error';
    const code = exception.code || 'INTERNAL_SERVER_ERROR';

    // Return formatted GraphQL error
    return new GraphQLError(message, {
      extensions: {
        code,
        timestamp: new Date().toISOString(),
        ...(exception.extensions || {}),
      },
    });
  }
}
