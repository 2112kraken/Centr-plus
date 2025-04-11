import { Global, Module } from '@nestjs/common';

import { PasswordService } from '@common/modules/security/password/password.service';

@Global()
@Module({
  exports: [PasswordService],
  providers: [PasswordService],
})
export class PasswordModule {}
