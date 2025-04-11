import { Injectable } from '@nestjs/common';

import { CurrencyCode } from '@common/enum/currency.enum';
import { CurrencyExchangeStrategy } from '@common/modules/currency-exchange/currency-exchange';

@Injectable()
export class LocalExchangeStrategy implements CurrencyExchangeStrategy {
  static rate: Record<string, Record<string, string>> = {
    USD: {
      USDT: '1',
      BTC: '0.0000113658',
    },
    BTC: {
      USD: '87983.248',
    },
    USDT: {
      USD: '1',
      BTC: '0.0000113658',
    },
  };

  async init(overrideRates?: Record<string, Record<string, string>>) {
    if (overrideRates) {
      LocalExchangeStrategy.rate = overrideRates;
    }
  }

  getRate(from: CurrencyCode, to: CurrencyCode) {
    if (from === to) {
      return '1';
    }

    const fromRate = LocalExchangeStrategy.rate[from];

    if (!fromRate) {
      throw new Error(`Currency ${from} not found`);
    }

    const toRate = fromRate[to];

    if (!toRate) {
      throw new Error(`Currency pair ${from}-${to} not found`);
    }

    return String(toRate);
  }
}
