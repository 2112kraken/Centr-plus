import { Controller, Get } from '@nestjs/common';

import { PspService } from './psp.service';

@Controller()
export class PspController {
  constructor(private readonly pspService: PspService) {}

  @Get()
  getHello(): string {
    return this.pspService.getHello();
  }
}
