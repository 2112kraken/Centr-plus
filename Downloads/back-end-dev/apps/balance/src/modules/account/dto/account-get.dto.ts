import { IsNotEmpty, IsNumberString } from 'class-validator';

import { RemoteProcedureDto } from '@app/nest-dto-rpc';

@RemoteProcedureDto()
export class AccountGetDto {
  @IsNumberString()
  @IsNotEmpty()
  accountId: string;
}
