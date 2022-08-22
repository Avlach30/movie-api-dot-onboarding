import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('studios')
export class Studio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'studio_number' })
  studioNumber: number;

  @Column({ name: 'seat_capacity' })
  seatCapacity: number;

  @Column({ type: 'timestamp' })
  created_at: string;

  @Column({ type: 'timestamp' })
  updated_at: string;
}
