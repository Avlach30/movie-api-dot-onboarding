import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from './movie.entity';
import { Studio } from './movieStudio.entity';

@Entity({ name: 'movie_schedules' })
export class MovieSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie, (movie) => movie.id, { eager: true }) //Reference to Movie entity)
  @JoinColumn({ name: 'movie_id' })
  movie_id: Movie;

  @ManyToOne(() => Studio, (studio) => studio.id, { eager: true }) //Reference to Studio entity
  @JoinColumn({ name: 'studio_id' })
  studio_id: Studio;

  @Column()
  start_time: string;

  @Column()
  end_time: string;

  @Column()
  price: number;

  @Column({ type: 'timestamp' })
  date: string;

  @Column({ type: 'timestamp' })
  created_at: string;

  @Column({ type: 'timestamp' })
  updated_at: string;
}
