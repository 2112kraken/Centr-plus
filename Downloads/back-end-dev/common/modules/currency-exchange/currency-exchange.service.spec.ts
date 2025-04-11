import { Test } from '@nestjs/testing';

import { CurrencyCode } from '@common/enum/currency.enum';
import { ConfigModule } from '@common/modules/config/config.module';
import { CurrencyExchangeConfig } from '@common/modules/config/configs';
import { CurrencyExchangeStrategy } from '@common/modules/currency-exchange/currency-exchange-strategy.enum';
import { CurrencyExchangeModule } from '@common/modules/currency-exchange/currency-exchange.module';
import { CurrencyExchangeService } from '@common/modules/currency-exchange/currency-exchange.service';
import { LocalExchangeStrategy } from '@common/modules/currency-exchange/strategies/local/local-exchange.strategy';

describe('ExchangeService', () => {
  let service: CurrencyExchangeService;
  let moduleRef: CurrencyExchangeModule;

  beforeAll(async () => {
    process.env.EXCHANGE_PROVIDER = CurrencyExchangeStrategy.LOCAL;

    const module = await Test.createTestingModule({
      imports: [
        {
          module: ConfigModule,
          providers: [{ provide: CurrencyExchangeConfig, useValue: { strategy: CurrencyExchangeStrategy.LOCAL } }],
          exports: [CurrencyExchangeConfig],
          global: true,
        },
        CurrencyExchangeModule,
      ],
    }).compile();

    moduleRef = module.get<CurrencyExchangeModule>(CurrencyExchangeModule);
    service = module.get<CurrencyExchangeService>(CurrencyExchangeService);
    module.get<LocalExchangeStrategy>(LocalExchangeStrategy).init({
      USD: {
        EUR: '0.9091',
        BTC: '0.00002000',
        USDT: '1',
      },
      EUR: {
        USD: '1.1000',
      },
      BTC: {
        USD: '50000.00',
      },
      ETH: {
        USD: '3000.00',
      },
      USDT: {
        USD: '1.0000',
      },
    });

    await moduleRef.onModuleInit();
  });

  describe('convert', () => {
    it.each([
      ['10000', CurrencyCode.USD, CurrencyCode.EUR, 2, 2, '9091'],
      ['100000000', CurrencyCode.BTC, CurrencyCode.USD, 8, 2, '5000000'],
      ['5000000000000000000', CurrencyCode.ETH, CurrencyCode.USD, 18, 2, '1500000'],
      ['1500', CurrencyCode.USDT, CurrencyCode.USD, 2, 2, '1500'],
      ['10000', CurrencyCode.USD, CurrencyCode.USDT, 2, 6, '100000000'],
      ['10000', CurrencyCode.USD, CurrencyCode.BTC, 2, 8, '200000'],
    ])(
      'should convert %s from %s to %s with inDecimals %d and outDecimals %d and return %s',
      async (amount, from, to, inDecimals, outDecimals, expected) => {
        const result = service.convert({
          amount,
          amountCurrencyCode: from,
          convertedCurrencyCode: to,
          amountDecimals: inDecimals,
          convertedAmountDecimals: outDecimals,
        });

        expect(result.convertedAmount).toBe(expected);
        expect(result.convertedCurrencyCode).toBe(to);
        expect(result.convertedAmountDecimals).toBe(outDecimals);
      },
    );
  });
});
