import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameVendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64 })
  name: string;

  @Column({ type: 'integer' })
  iconId: number;

  @Column({ length: 64, unique: true })
  slug: string;

  @Column('varchar', { array: true, length: 2 })
  regions?: string[];

  @Column('varchar', { array: true, length: 2 })
  languages: string[];
}
