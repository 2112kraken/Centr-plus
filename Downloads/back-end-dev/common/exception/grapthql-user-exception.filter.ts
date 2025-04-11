import { GraphQLError } from 'graphql';

import { Catch, ExceptionFilter } from '@nestjs/common';

import { UserException } from '@common/exception/user.exception';

@Catch(UserException)
export class GraphQLUserExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch({ stack, ...exception }: UserException) {
    return new GraphQLError(exception.message, {
      extensions: exception,
    });
  }
}
