import Big from 'bignumber.js';

import { BadRequestException, Injectable } from '@nestjs/common';

import { CurrencyExchangeConfig } from '@common/modules/config/configs';
import {
  CurrencyExchangeConvert,
  CurrencyExchangeConvertResponse,
} from '@common/modules/currency-exchange/currency-exchange';
import { CurrencyExchangeStrategy } from '@common/modules/currency-exchange/currency-exchange-strategy.enum';
import { LocalExchangeStrategy } from '@common/modules/currency-exchange/strategies/local/local-exchange.strategy';

@Injectable()
export class CurrencyExchangeService {
  constructor(
    private readonly localExchangeStrategy: LocalExchangeStrategy,
    private readonly currencyExchangeConfig: CurrencyExchangeConfig,
  ) {}

  private get exchangeStrategy() {
    switch (this.currencyExchangeConfig.strategy) {
      case CurrencyExchangeStrategy.LOCAL:
        return this.localExchangeStrategy;
      default:
        throw new Error(`Unsupported currency exchange strategy: ${this.currencyExchangeConfig.strategy}`);
    }
  }

  convertForPlatform(dto: Omit<CurrencyExchangeConvert, 'convertedAmountDecimals'>) {
    return this.convert({
      ...dto,
      convertedAmountDecimals: 18,
    });
  }

  convertForProvider(dto: Omit<CurrencyExchangeConvert, 'amountDecimals'>) {
    return this.convert({
      ...dto,
      amountDecimals: 18,
    });
  }

  convert(data: CurrencyExchangeConvert): CurrencyExchangeConvertResponse {
    const { amount, amountCurrencyCode, amountDecimals, convertedCurrencyCode, convertedAmountDecimals } = data;

    const rate = this.exchangeStrategy.getRate(data.amountCurrencyCode, data.convertedCurrencyCode);

    // Convert and format immediately
    const convertedAmount = new Big(amount)
      .shiftedBy(-amountDecimals)
      .times(rate)
      .shiftedBy(convertedAmountDecimals)
      .integerValue(Big.ROUND_DOWN)
      .toFixed();

    // Check if result fits in numeric(32)
    const TOTAL_DIGITS = 32;
    if (convertedAmount.replace('.', '').length > TOTAL_DIGITS) {
      throw new BadRequestException('Converted amount exceeds maximum allowed value');
    }

    return {
      rate,
      amount,
      amountDecimals,
      amountCurrencyCode,
      convertedAmount,
      convertedCurrencyCode,
      convertedAmountDecimals,
    };
  }
}
