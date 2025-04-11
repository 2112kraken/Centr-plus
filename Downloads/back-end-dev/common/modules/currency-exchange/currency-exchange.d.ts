import { CurrencyCode } from '@common/enum/currency.enum';

export type CurrencyRates = {
  [key in keyof typeof CurrencyCode]: string;
};

export type CurrencyRatesMatrix = {
  [key in keyof typeof CurrencyCode]: CurrencyRates;
};

export interface CurrencyExchangeConvert {
  amount: string;
  amountCurrencyCode: CurrencyCode;
  amountDecimals: number;

  convertedCurrencyCode: CurrencyCode;
  convertedAmountDecimals: number;
}

export class CurrencyExchangeConvertResponse {
  amount: string;
  amountCurrencyCode: CurrencyCode;
  amountDecimals: number;

  convertedAmount: string;
  convertedCurrencyCode: CurrencyCode;
  convertedAmountDecimals: number;

  rate: string;
}

export interface CurrencyExchangeStrategy {
  init(): Promise<void>;
  getRate(from: CurrencyCode, to: CurrencyCode): string;
}
