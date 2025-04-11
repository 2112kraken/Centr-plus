import { Global, Module } from '@nestjs/common';

import { ErrorService } from '@identity/common/exceptions/error.service';

@Global()
@Module({
  providers: [ErrorService],
  exports: [ErrorService],
})
export class ErrorModule {}
