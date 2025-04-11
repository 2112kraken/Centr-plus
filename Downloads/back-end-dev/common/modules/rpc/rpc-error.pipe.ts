import { throwError } from 'rxjs';

import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { TtLogger } from '@app/logger';

import { UserException } from '@common/exception/user.exception';

@Catch()
export class RpcUserExceptionFilter implements RpcExceptionFilter {
  constructor(private readonly logger: TtLogger) {}

  catch(exception: UserException) {
    this.logger.error({
      err: exception,
      msg: 'Rpc user exception caught.',
    });

    const rpcError = new RpcException({
      status: 'error',
      code: exception.code,
      message: exception.message,
      details: exception.details,
    });

    return throwError(() => rpcError);
  }
}
