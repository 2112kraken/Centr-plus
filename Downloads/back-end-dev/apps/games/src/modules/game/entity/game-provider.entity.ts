import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ProviderCode {
  INFIN = 'INFIN',
}

@Entity()
export class GameProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: ProviderCode;
}
