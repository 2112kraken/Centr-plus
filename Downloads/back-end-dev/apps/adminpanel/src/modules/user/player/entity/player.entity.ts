import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Entity,
  JoinColumn,
  OneToOne,
  ManyToMany,
} from 'typeorm';

import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Lang2 } from '@common/enum/lang.enum';

import { Role } from '@adminpanel/modules/rbac/entity/role.entity';
import { Session } from '@adminpanel/modules/session/session.entity';
import { PlayerContact } from '@adminpanel/modules/user/player/entity/player-contact.entity';
import { PlayerInfo } from '@adminpanel/modules/user/player/entity/player-info.entity';

@ObjectType()
@Entity()
export class Player {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', nullable: true })
  infoId: string;

  @Field()
  @Column({ unique: true })
  normalizedUsername: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @Field(() => Lang2)
  @Column({ type: 'enum', enum: Lang2, default: Lang2.EN })
  lang2: Lang2;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Session], { defaultValue: [] })
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

  @Field(() => [Role], { defaultValue: [] })
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
