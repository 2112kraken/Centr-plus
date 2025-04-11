import { IsEnum, IsInt, IsNumberString, IsOptional, IsPositive } from 'class-validator';

import { CurrencyCode } from '@common/enum/currency.enum';

export enum AmountDecimals {
  HUNDREDS = 2,
  NATIVE = 18,
}

export class AssetAmountDto {
  @IsNumberString()
  amount: string;

  @IsInt()
  @IsOptional()
  @IsPositive()
  decimals: AmountDecimals;

  @IsEnum(CurrencyCode)
  currencyCode: CurrencyCode;
}
