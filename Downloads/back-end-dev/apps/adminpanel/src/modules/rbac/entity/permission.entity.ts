import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { PermissionName } from '@common/enum/permission-name.enum';
import { UserScope } from '@common/modules/security/jwt/enum/user-scope.enum';

import { Role } from '@adminpanel/modules/rbac/entity/role.entity';

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
