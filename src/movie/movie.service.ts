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

  async getAllmovies() {
    const movies = await this.movieRepository.find();
    const tags = await this.tagRepository.find();
    const movieTags = await this.movieTagRepository.query(
      'SELECT id as movieTagId, movie_id, tag_id FROM movie_tags',
    );

    const mappingMovieTags = movieTags.map((movieTag) => ({
      ...movieTag,
      ...tags.find((tag) => movieTag.tag_id == tag.id),
    }));

    mappingMovieTags.forEach((movieTag) => {
      delete movieTag.movieTagId;
      delete movieTag.id;
      delete movieTag.created_at;
      delete movieTag.updated_at;
    });

    console.log(mappingMovieTags);

    console.log(movies);

    const mergedMovieTags: Array<any> = [];

    mappingMovieTags.forEach((movieTag) => {
      const exist = mergedMovieTags.filter((value) => {
        return value.movie_id == movieTag.movie_id;
      });

      if (exist.length) {
        const existingIndex = mergedMovieTags.indexOf(exist[0]);
        mergedMovieTags[existingIndex].tag_id = mergedMovieTags[
          existingIndex
        ].tag_id.concat(movieTag.tag_id);
        mergedMovieTags[existingIndex].name = mergedMovieTags[
          existingIndex
        ].name.concat(movieTag.name);
      } else {
        if (
          typeof movieTag.tag_id == 'string' &&
          typeof movieTag.name == 'string'
        )
          movieTag.tag_id = [movieTag.tag_id];
        movieTag.name = [movieTag.name];
        mergedMovieTags.push(movieTag);
      }
    });

    const mappingMovies = movies.map((movie) => ({
      ...movie,
      ...mergedMovieTags.find(
        (mergedMovieTag) => mergedMovieTag.movie_id == movie.id,
      ),
    }));

    // console.log(mappingMovies);

    const mappingAllMovies = mappingMovies.map((mappingMovie) => {
      const combined = mappingMovie.tag_id.map((tag, idx) => {
        return {
          id: tag,
          name: mappingMovie.name[idx],
        };
      });

      // console.log(combined);

      const obj = {
        id: mappingMovie.id,
        title: mappingMovie.title,
        overview: mappingMovie.overview,
        poster: mappingMovie.poster,
      };

      for (let index = 0; index < combined.length; index++) {
        const tags = `tags${index}`;
        obj[tags] = combined[index];
      }

      return obj;
    });

    // console.log(mappingAllMovies);

    return {
      success: true,
      data: mappingAllMovies,
      message: 'Get all movie successfully',
    };
  }
}
