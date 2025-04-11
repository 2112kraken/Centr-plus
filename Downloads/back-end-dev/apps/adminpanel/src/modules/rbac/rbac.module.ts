import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Permission } from '@adminpanel/modules/rbac/entity/permission.entity';
import { Role } from '@adminpanel/modules/rbac/entity/role.entity';
import { RbacResolver } from '@adminpanel/modules/rbac/rbac.resolver';
import { RbacService } from '@adminpanel/modules/rbac/rbac.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  providers: [RbacService, RbacResolver],
})
export class RbacModule {}
