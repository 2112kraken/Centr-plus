import { Module } from '@nestjs/common';

import { BalanceService } from '@common/modules/balance/balance.service';

@Module({
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}
