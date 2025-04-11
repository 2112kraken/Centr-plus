import { Body, Controller, Header, Post, UseFilters, HttpException, HttpStatus } from '@nestjs/common';

import { TtLogger } from '@app/logger';

import { InfinService } from '@games/providers/infin/infin.service';

import { InfinCatch } from './infin.catnch';

@Controller('infin')
@UseFilters(InfinCatch)
export class InfinController {
  constructor(
    private readonly infinService: InfinService,
    private readonly logger: TtLogger,
  ) {}

  @Post('/')
  @Header('Content-Type', 'application/xml')
  async wallet(@Body() body: Record<string, any>) {
    if (body.server.roundbet) {
      return this.infinService.roundbet(body);
    }

    if (body.server.roundwin) {
      return this.infinService.roundwin(body);
    }

    if (body.server.enter) {
      return this.infinService.enter(body);
    }

    if (body.server['re-enter']) {
      return this.infinService.reEnter(body);
    }

    if (body.server.refund) {
      return this.infinService.refund(body);
    }

    if (body.server.getbalance) {
      return this.infinService.getbalance(body);
    }

    this.logger.error({
      err: new Error('Invalid request'),
      data: body,
      msg: 'No matching method.',
    });

    throw new HttpException(
      `<?xml version="1.0" encoding="UTF-8"?>
        <error>
          <code>400</code>
          <message>Invalid request</message>
        </error>`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
