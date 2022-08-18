import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
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
    private configService: ConfigService,
  ) {}

  async createMovie(createMovieDto: CreateMovieDto, file: any, req: any) {
    const admin = req.user.isUserAdmin;
    if (!admin) throw new ForbiddenException('Forbidden to access, only admin');

    const tags = createMovieDto.tags;

    // eslint-disable-next-line prettier/prettier
    const poster = `http://localhost:${this.configService.get<number>('port')}/assets${file.path.replace(/\\/g, '/').substring('public'.length)}`;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    let movie;
    try {
      const newMovie = await queryRunner.manager.create(Movie, {
        title: createMovieDto.title,
        overview: createMovieDto.overview,
        poster: poster,
        play_until: createMovieDto.play_until,
        created_at: generateDateNow(),
        updated_at: generateDateNow(),
      });

      await queryRunner.manager.save(newMovie);

      tags.forEach(async (tag) => {
        const newTag = await queryRunner.manager.create(Tag, {
          name: tag,
          created_at: generateDateNow(),
          updated_at: generateDateNow(),
        });

        await queryRunner.manager.save(newTag);

        const newMovieTag = new MovieTag();
        newMovieTag.movie_id = newMovie;
        newMovieTag.tag_id = newTag;
        newMovieTag.created_at = generateDateNow();
        newMovieTag.updated_at = generateDateNow();

        await queryRunner.manager.save(newMovieTag);
      });

      movie = newMovie;

      await queryRunner.commitTransaction();

      return {
        data: movie,
        message: 'Add new movie successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException('Create new movie failed');
    }
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
