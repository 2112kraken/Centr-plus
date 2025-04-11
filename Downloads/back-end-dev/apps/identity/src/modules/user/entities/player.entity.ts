import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';

import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Lang2 } from '@common/enum/lang.enum';

import { Role } from '@identity/modules/rbac/entity/role.entity';
import { Session } from '@identity/modules/session/session.entity';
import { PlayerContact } from '@identity/modules/user/entities/player-contact.entity';
import { PlayerInfo } from '@identity/modules/user/entities/player-info.entity';

@ObjectType()
@Entity()
export class Player {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', nullable: true })
  infoId: string;

  @Column({ unique: true })
  normalizedUsername: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @Field()
  @Column({ type: 'enum', enum: Lang2, default: Lang2.EN })
  lang2: Lang2;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @JoinColumn()
  @OneToMany(() => Session, (session) => session.player)
  sessions?: Session[];

  @Field(() => PlayerInfo, { nullable: true })
  @OneToOne(() => PlayerInfo, (info) => info.player, { cascade: true })
  @JoinColumn()
  info?: PlayerInfo;

  @Field(() => [PlayerContact], { defaultValue: [] })
  @OneToMany(() => PlayerContact, (contact) => contact.player, {
    cascade: true,
  })
  contacts?: PlayerContact[];

  @ManyToMany(() => Role, (role) => role.players)
  roles?: Role[];

  get mainContact(): PlayerContact {
    const contact = this.contacts?.find((v) => v.isMain);

    if (!contact) {
      throw new Error(`player "(${this.username})"(${this.id}) don't have main contact`);
    }

    return contact;
  }
}
