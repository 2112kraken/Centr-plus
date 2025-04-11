import { IsString, IsNotEmpty, IsOptional, IsNumberString, IsEnum } from 'class-validator';

import { RemoteProcedureDto } from '@app/nest-dto-rpc';

import { CurrencyCode } from '@common/enum/currency.enum';

import { TransactionType, TransactionSubType } from '@balance/modules/transaction/transaction.entity';

@RemoteProcedureDto()
export class AccountApplyTransactionDto {
  @IsNumberString()
  @IsNotEmpty()
  accountId: string;

  @IsNumberString()
  @IsNotEmpty()
  playerId: string;

  @IsString()
  @IsNotEmpty()
  currencyCode: CurrencyCode;

  @IsNumberString()
  @IsNotEmpty()
  amount: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsEnum(TransactionSubType)
  subtype: TransactionSubType;

  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  triggeredByAdminId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  externalId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  rollbackTransactionId?: string;
}
