import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

import { RemoteProcedureDto } from '@app/nest-dto-rpc';

import { CurrencyCode } from '@common/enum/currency.enum';

@RemoteProcedureDto()
export class AccountCreateIfNotExistsDto {
  @IsNumberString()
  @IsNotEmpty()
  playerId: string;

  @IsString()
  @IsNotEmpty()
  currencyCode: CurrencyCode;
}
