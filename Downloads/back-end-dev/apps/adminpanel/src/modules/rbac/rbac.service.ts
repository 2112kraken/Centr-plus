import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TtLogger } from '@app/logger';

import { PermissionName } from '@common/enum/permission-name.enum';
import { UserScope } from '@common/modules/security/jwt/enum/user-scope.enum';

import { Permission } from '@adminpanel/modules/rbac/entity/permission.entity';
import { Role } from '@adminpanel/modules/rbac/entity/role.entity';

@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(Role)
    readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    readonly permissionRepository: Repository<Permission>,
    private readonly logger: TtLogger,
  ) {}

  async getUserPermissions(scope: UserScope, userId: string) {
    const qb = this.roleRepository.createQueryBuilder('role');

    if (scope === UserScope.ADMIN) {
      qb.leftJoin('role.admins', 'admin').where('admin.id = :userId', {
        userId,
      });
    }

    if (scope === UserScope.PLAYER) {
      qb.leftJoin('role.players', 'player').where('player.id = :userId', {
        userId,
      });
    }

    const roles = await qb.getMany();

    return this.getRolePermissions(roles.map((r) => r.id));
  }

  async getRolePermissions(roleIds: number[]): Promise<Set<PermissionName>>;
  async getRolePermissions(roleIds: number[], acc?: Set<PermissionName>, depth?: number): Promise<Set<PermissionName>>;
  async getRolePermissions(
    roleIds: number[],
    acc: Set<PermissionName> = new Set(),
    depth = 0,
  ): Promise<Set<PermissionName>> {
    const MAX_DEPTH = 5;
    const parentRoleIds: number[] = [];
    const roles = await this.roleRepository.find({
      where: { id: In(roleIds) },
      relations: ['permissions', 'parentRoles'],
    });

    const permissions = roles.reduce((permissions, role) => {
      role.permissions.forEach((permission) => {
        permissions.add(permission.name);
      });

      if (role.parentRoles.length) {
        parentRoleIds.push(...role.parentRoles.map((r) => r.id));
      }

      return permissions;
    }, acc);

    if (parentRoleIds.length && depth < MAX_DEPTH) {
      return this.getRolePermissions(parentRoleIds, permissions, depth + 1);
    }

    if (depth >= MAX_DEPTH) {
      this.logger.warn({
        msg: 'Max role depth reached',
        data: { roleIds, depth },
      });
    }

    return permissions;
  }
}
