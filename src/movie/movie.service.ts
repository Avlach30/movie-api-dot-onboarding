import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Movie } from '../entities/movie.entity';
import { Tag } from '../entities/tag.entity';
import { MovieTag } from '../entities/movieTag.entity';
import { CreateMovieDto } from '../dto/createMovie.dto';
import { generateDateNow } from 'src/utils/date-now';
import { AddMovieStudioDto } from 'src/dto/addNewStudio.dto';
import { Studio } from 'src/entities/movieStudio.entity';
import { MovieSchedule } from 'src/entities/movieSchedule.entity';
import { AddMovieScheduleDto } from 'src/dto/addNewSchedule.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(MovieTag)
    private movieTagRepository: Repository<MovieTag>,
    @InjectRepository(Studio)
    private movieStudioRepository: Repository<Studio>,
    @InjectRepository(MovieSchedule)
    private movieScheduleRepository: Repository<MovieSchedule>,
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

    return {
      success: true,
      data: movies,
      message: 'Get all movie successfully',
    };
  }

  async addStudio(addNewStudioDto: AddMovieStudioDto) {
    const newStudio = await this.movieStudioRepository.create({
      studio_number: addNewStudioDto.studio_number,
      seat_capacity: addNewStudioDto.seat_capacity,
      created_at: generateDateNow(),
      updated_at: generateDateNow(),
    });

    await this.movieStudioRepository.save(newStudio);

    return {
      success: true,
      data: newStudio,
      message: 'Penambahan studio baru berhasil',
    };
  }

  async addNewSchedule(dto: AddMovieScheduleDto) {
    const newSchedule = new MovieSchedule();

    const studio = await this.movieStudioRepository.findOne({
      where: {
        id: dto.studio_id,
      },
    });

    const movie = await this.movieRepository.findOne({
      where: {
        id: dto.movie_id,
      },
    });

    newSchedule.movie_id = movie;
    newSchedule.studio_id = studio;
    newSchedule.start_time = dto.start_time;
    newSchedule.end_time = dto.end_time;
    newSchedule.price = dto.price;
    newSchedule.date = dto.date;

    newSchedule.created_at = generateDateNow();
    newSchedule.updated_at = generateDateNow();

    await this.movieScheduleRepository.save(newSchedule);

    return {
      success: true,
      data: newSchedule,
      message: 'Penambahan jadwal baru berhasil',
    };
  }

  async getNowSchedule() {
    const dateNow = new Date().toISOString().split('T')[0];

    //* Inner join 3 table with like criteria
    const schedule = await this.movieScheduleRepository
      .createQueryBuilder('movie_schedules')
      .where('movie_schedules.date like :date', { date: `${dateNow}%` })
      .innerJoinAndSelect('movie_schedules.movie_id', 'movies')
      .innerJoinAndSelect('movie_schedules.studio_id', 'studios')
      .getMany();

    return {
      success: true,
      data: schedule,
      message: 'Get now movie schedule successfully',
    };
  }

  //* Run this function every 2 hours
  @Cron(CronExpression.EVERY_2_HOURS, { name: 'Get all movie schedules' })
  async getAllSchedule() {
    const allSchedules = await this.movieScheduleRepository.find();
    Logger.log('Get all movie schedule . . .');
    console.log(allSchedules);
  }

  async getAllTags() {
    const tags = await this.tagRepository.find();

    return {
      success: true,
      data: tags,
      message: 'Get all movie tags successfully',
    };
  }
}
