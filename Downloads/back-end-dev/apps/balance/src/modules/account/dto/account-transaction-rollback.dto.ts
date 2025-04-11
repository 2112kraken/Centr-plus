import { IsString, IsNotEmpty } from 'class-validator';

import { RemoteProcedureDto } from '@app/nest-dto-rpc';

import { Account } from '@balance/modules/account/account.entity';
import { Transaction } from '@balance/modules/transaction/transaction.entity';

@RemoteProcedureDto()
export class AccountRollbackTransactionDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;
  externalRollbackId?: string;
}

export class AccountRollbackTransactionResponseDto {
  transaction: Transaction;
  account: Account;
  duplicate?: boolean;
}
