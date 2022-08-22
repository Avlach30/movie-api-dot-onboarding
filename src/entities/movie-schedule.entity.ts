import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from './movie.entity';
import { Studio } from './movie-studio.entity';

@Entity({ name: 'movie_schedules' })
export class MovieSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie, (movie) => movie.id, { eager: true }) //Reference to Movie entity)
  @JoinColumn({ name: 'movie_id' })
  movieId: Movie;

  @ManyToOne(() => Studio, (studio) => studio.id, { eager: true }) //Reference to Studio entity
  @JoinColumn({ name: 'studio_id' })
  studioId: Studio;

  @Column({ name: 'start_time' })
  startTime: string;

  @Column({ name: 'end_time' })
  endTime: string;

  @Column()
  price: number;

  @Column({ type: 'timestamp' })
  date: string;

  @Column({ type: 'timestamp' })
  created_at: string;

  @Column({ type: 'timestamp' })
  updated_at: string;
}
