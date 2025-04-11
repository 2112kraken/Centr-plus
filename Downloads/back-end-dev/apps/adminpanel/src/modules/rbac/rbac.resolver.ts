import { Args, ID, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';

import { PermissionName } from '@common/enum/permission-name.enum';

import { Role } from '@adminpanel/modules/rbac/entity/role.entity';
import { RbacService } from '@adminpanel/modules/rbac/rbac.service';

@Resolver(() => Role)
export class RbacResolver {
  constructor(private readonly rbacService: RbacService) {}

  @ResolveField(() => [PermissionName])
  permissions(@Root() role: Role) {
    return this.rbacService.getRolePermissions([role.id]);
  }

  @Query(() => [Role])
  roles() {
    return this.rbacService.roleRepository.find({
      relations: ['permissions', 'parentRoles'],
    });
  }

  @Query(() => Role)
  role(@Args('id', { type: () => ID }) id: number) {
    return this.rbacService.roleRepository.findOneOrFail({
      where: { id },
      relations: ['permissions', 'parentRoles'],
    });
  }
}
