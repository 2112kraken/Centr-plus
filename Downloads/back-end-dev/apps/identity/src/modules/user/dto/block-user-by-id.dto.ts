import { RemoteProcedureDto } from '@app/nest-dto-rpc';

import { UserScope } from '@common/modules/security/jwt/enum/user-scope.enum';

@RemoteProcedureDto()
export class BlockUserByIdRpcDto {
  userId: string;
  reason: string;
  scope: UserScope;
}
