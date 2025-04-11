import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserScope } from '@common/modules/security/jwt/enum/user-scope.enum';

import { Role } from '@identity/modules/rbac/entity/role.entity';

export enum PermissionName {
  // Player permissions
  PLAYER_READ = 'PLAYER_READ',
  PLAYER_WRITE = 'PLAYER_WRITE',
  PLAYER_DELETE = 'PLAYER_DELETE',

  // Admin permissions
  ADMIN_READ = 'ADMIN_READ',
  ADMIN_WRITE = 'ADMIN_WRITE',
  ADMIN_DELETE = 'ADMIN_DELETE',

  // Role management
  ROLE_READ = 'ROLE_READ',
  ROLE_WRITE = 'ROLE_WRITE',
  ROLE_DELETE = 'ROLE_DELETE',

  // Permission management
  PERMISSION_READ = 'PERMISSION_READ',
  PERMISSION_WRITE = 'PERMISSION_WRITE',
  PERMISSION_DELETE = 'PERMISSION_DELETE',
}

@Entity()
export class Permission {
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number;

  @Column({ enum: PermissionName })
  name: PermissionName;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @Column({ enum: UserScope })
  scope: UserScope;
}
