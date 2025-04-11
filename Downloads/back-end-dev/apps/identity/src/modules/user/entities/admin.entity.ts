import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Entity,
  JoinColumn,
  ManyToMany,
} from 'typeorm';

import { Field, ObjectType } from '@nestjs/graphql';

import { Role } from '@identity/modules/rbac/entity/role.entity';
import { Session } from '@identity/modules/session/session.entity';
import { AdminContact } from '@identity/modules/user/entities/admin-contact.entity';

@ObjectType()
@Entity()
export class Admin {
  @Field()
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column()
  passwordHash: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Session])
  @JoinColumn({ name: 'adminId' })
  @OneToMany(() => Session, (session) => session.admin, { cascade: true })
  sessions: Session[];

  @OneToMany(() => AdminContact, (contact) => contact.admin, { cascade: true })
  contacts: AdminContact[];

  @ManyToMany(() => Role, (role) => role.admins, { cascade: true })
  roles: Role[];

  get mainContact(): AdminContact {
    const contact = this.contacts?.find((v) => v.isMain);

    if (!contact) {
      throw new Error(`admin "(${this.id})" don't have main contact`);
    }

    return contact;
  }
}
