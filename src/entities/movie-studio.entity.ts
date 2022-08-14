import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('studios')
export class Studio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studio_number: number;

  @Column()
  seat_capacity: number;

  @Column({ type: 'timestamp' })
  created_at: string;

  @Column({ type: 'timestamp' })
  updated_at: string;
}
