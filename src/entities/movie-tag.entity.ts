import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from './movie.entity';
import { Tag } from './tag.entity';

@Entity('movie_tags')
export class MovieTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie, (movie) => movie.id, { eager: true }) //Reference to Movie entity
  @JoinColumn({ name: 'movie_id' })
  movie_id: Movie;

  @ManyToOne(() => Tag, (tag) => tag.id, { eager: true }) //Reference to Tags entity
  @JoinColumn({ name: 'tag_id' })
  tag_id: Tag;

  @Column({ type: 'timestamp' })
  created_at: string;

  @Column({ type: 'timestamp' })
  updated_at: string;
}
