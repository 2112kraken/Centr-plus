import { Global, Module } from '@nestjs/common';

import { TempTokenService } from '@common/modules/security/temp-token/temp-token.service';

@Global()
@Module({
  exports: [TempTokenService],
  providers: [TempTokenService],
})
export class TempTokenModule {}
