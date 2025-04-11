import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

import { PermissionName } from '@common/enum/permission-name.enum';
import { UserScope } from '@common/modules/security/jwt/enum/user-scope.enum';

import { Permission } from '@adminpanel/modules/rbac/entity/permission.entity';
import { Admin } from '@adminpanel/modules/user/admin/entity/admin.entity';
import { Player } from '@adminpanel/modules/user/player/entity/player.entity';

registerEnumType(PermissionName, { name: 'PermissionName' });

@ObjectType()
@Entity()
export class Role {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number;

  @Field()
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
