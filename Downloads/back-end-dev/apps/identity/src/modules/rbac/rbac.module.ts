import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Permission } from '@identity/modules/rbac/entity/permission.entity';
import { Role } from '@identity/modules/rbac/entity/role.entity';
import { RbacController } from '@identity/modules/rbac/rbac.controller';
import { RbacService } from '@identity/modules/rbac/rbac.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  providers: [RbacService],
  exports: [RbacService],
  controllers: [RbacController],
})
export class RbacModule {}
