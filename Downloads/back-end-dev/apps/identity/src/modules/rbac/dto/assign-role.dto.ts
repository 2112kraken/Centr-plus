import { RemoteProcedureDto } from '@app/nest-dto-rpc';

import { Role } from '@identity/modules/rbac/entity/role.entity';

@RemoteProcedureDto()
export class AssignRoleDto {
  userId: string;
  roleId: number;
}

export class AssignRoleResponseDto {
  id: string;
  roles: Role[];
}
