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

  @ManyToOne((type) => Movie, (movie) => movie.id) //Reference to Movie entity
  @JoinColumn()
  movie_id: Movie;

  @ManyToOne((type) => Tag, (tag) => tag.id) //Reference to Tags entity
  @JoinColumn()
  tag_id: Tag;

  @Column({ type: 'timestamp' })
  created_at: string;

  @Column({ type: 'timestamp' })
  updated_at: string;
}
