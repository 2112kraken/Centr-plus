import { Module } from '@nestjs/common';

import { AccountModule } from '@balance/modules/account/account.module';

@Module({
  imports: [AccountModule],
})
export class BalanceModule {}
