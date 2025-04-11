import { PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column, Entity, JoinColumn } from 'typeorm';

import { Field, ObjectType } from '@nestjs/graphql';

import { Admin } from '@adminpanel/modules/user/admin/entity/admin.entity';
import { Player } from '@adminpanel/modules/user/player/entity/player.entity';

@ObjectType()
@Entity()
export class Session {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  sessionId: string;

  @Column({ type: 'varchar', precision: 64 })
  sessionHash: string;

  @Column({ nullable: true })
  playerId?: number;

  @Column({ nullable: true })
  adminId?: number;

  @Column({ default: true })
  isActive: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  userAgent?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  ipAddress?: string;

  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  expiresAt: Date;

  @JoinColumn({ name: 'playerId' })
  @ManyToOne(() => Player, (player) => player.sessions)
  player: Player;

  @JoinColumn({ name: 'adminId' })
  @ManyToOne(() => Admin, (admin) => admin.sessions)
  admin: Admin;

  get isExpired() {
    return new Date() >= this.expiresAt;
  }
}
