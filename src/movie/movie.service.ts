import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { Movie } from '../entities/movie.entity';
import { Tag } from '../entities/tag.entity';
import { MovieTag } from '../entities/movie-tag.entity';
import { CreateMovieDto } from '../dto/create-movie.dto';
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

      await this.tagRepository.save(newTag);

      const newMovieTag = new MovieTag();
      newMovieTag.movie_id = movie;
      newMovieTag.tag_id = newTag;
      newMovieTag.created_at = generateDateNow();
      newMovieTag.updated_at = generateDateNow();

      await this.movieTagRepository.save(newMovieTag);
    });

    return {
      data: movie,
      message: 'Add new movie successfully',
    };
  }

  async getAllmovies() {
    const movies = await this.movieRepository.find();

    return {
      data: movies,
      message: 'Get all movie successfully',
    };
  }

  async getAllTags() {
    const tags = await this.tagRepository.find();

    return {
      data: tags,
      message: 'Get all movie tags successfully',
    };
  }
}
