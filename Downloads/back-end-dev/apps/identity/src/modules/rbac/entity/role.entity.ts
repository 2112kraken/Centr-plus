import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserScope } from '@common/modules/security/jwt/enum/user-scope.enum';

import { Permission } from '@identity/modules/rbac/entity/permission.entity';
import { Admin } from '@identity/modules/user/entities/admin.entity';
import { Player } from '@identity/modules/user/entities/player.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'roles_to_permissions',
    joinColumn: { name: 'roleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  @Column({ enum: UserScope })
  scope: UserScope;

  @ManyToMany(() => Role, (role) => role.parentRoles)
  @JoinTable({
    name: 'roles_to_roles',
    joinColumn: { name: 'parentRoleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  parentRoles: Role[];

  @ManyToMany(() => Admin, (admin) => admin.roles)
  @JoinTable({
    name: 'roles_to_admins',
    joinColumn: { name: 'roleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'adminId', referencedColumnName: 'id' },
  })
  admins: Admin[];

  @ManyToMany(() => Player, (player) => player.roles)
  @JoinTable({
    name: 'roles_to_players',
    joinColumn: { name: 'roleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'playerId', referencedColumnName: 'id' },
  })
  players: Player[];
}
