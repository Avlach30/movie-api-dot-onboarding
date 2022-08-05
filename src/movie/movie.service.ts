import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { Movie } from '../entities/movie.entity';
import { Tag } from '../entities/tag.entity';
import { MovieTag } from '../entities/movieTag.entity';
import { CreateMovieDto } from '../dto/createMovie.dto';
import { generateDateNow } from 'src/utils/date-now';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(MovieTag)
    private movieTagRepository: Repository<MovieTag>,
    private configService: ConfigService,
  ) {}

  async createMovie(createMovieDto: CreateMovieDto, file: any) {
    const tags = createMovieDto.tags;

    // eslint-disable-next-line prettier/prettier
    const poster = `http://localhost:${this.configService.get<number>('port')}/assets${file.path.replace(/\\/g, '/').substring('public'.length)}`;

    const newMovie = await this.movieRepository.create({
      title: createMovieDto.title,
      overview: createMovieDto.overview,
      poster: poster,
      play_until: createMovieDto.play_until,
      created_at: generateDateNow(),
      updated_at: generateDateNow(),
    });

    const movie = await this.movieRepository.save(newMovie);

    tags.forEach(async (tag) => {
      const newTag = await this.tagRepository.create({
        name: tag,
        created_at: generateDateNow(),
        updated_at: generateDateNow(),
      });

      const saveTag = await this.tagRepository.save(newTag);

      await this.movieTagRepository.query(
        'INSERT INTO movie_tags (movie_id, tag_id, created_at, updated_at) VALUES(?, ?, ?, ?)',
        [movie.id, saveTag.id, generateDateNow(), generateDateNow()],
      );
    });

    return {
      success: true,
      data: {
        title: movie.title,
        overview: movie.overview,
        poster: movie.poster,
        play_until: movie.play_until,
      },
      message: 'Penambahan film baru berhasil',
    };
  }
}
