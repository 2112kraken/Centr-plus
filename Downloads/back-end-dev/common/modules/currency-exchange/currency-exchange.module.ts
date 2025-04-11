import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { CurrencyExchangeService } from '@common/modules/currency-exchange/currency-exchange.service';
import { LocalExchangeStrategy } from '@common/modules/currency-exchange/strategies/local/local-exchange.strategy';

@Global()
@Module({
  providers: [CurrencyExchangeService, LocalExchangeStrategy],
  exports: [CurrencyExchangeService],
})
export class CurrencyExchangeModule implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    const localExchangeStrategy = this.moduleRef.get(LocalExchangeStrategy);
    await localExchangeStrategy.init();
  }
}
