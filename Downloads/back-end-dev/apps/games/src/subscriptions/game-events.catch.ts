import { Observable, throwError } from 'rxjs';

import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
import { KafkaContext } from '@nestjs/microservices/ctx-host';

import { TtLogger } from '@app/logger';

@Catch()
export class GameEventsExceptionFilter extends BaseRpcExceptionFilter {
  constructor(private readonly logger: TtLogger) {
    super();
  }

  catch(exception: any, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToRpc().getContext<KafkaContext>();
    const message = ctx.getMessage();
    const topic = ctx.getTopic();
    const partition = ctx.getPartition();

    this.logger.error({
      err: exception,
      msg: 'Error processing game event',
      data: {
        topic,
        partition,
        message,
      },
    });

    // Return Observable that emits the error
    return throwError(() => exception);
  }
}
