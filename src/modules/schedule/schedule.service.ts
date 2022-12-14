import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

import { AddMovieScheduleDto } from 'src/dto/add-new-schedule.dto';
import { MovieSchedule } from 'src/entities/movie-schedule.entity';
import { Studio } from 'src/entities/movie-studio.entity';
import { Movie } from 'src/entities/movie.entity';
import { generateDateNow } from 'src/utils/date-now';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(MovieSchedule)
    private scheduleRepository: Repository<MovieSchedule>,
    @InjectRepository(Studio)
    private studioRepository: Repository<Studio>,
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
  ) {}

  async addNewSchedule(dto: AddMovieScheduleDto, req: any) {
    const admin = req.user.isUserAdmin;
    if (!admin) throw new ForbiddenException('Forbidden to access, only admin');

    const newSchedule = new MovieSchedule();

    const studio = await this.studioRepository.findOne({
      where: {
        id: dto.studio_id,
      },
    });

    const movie = await this.movieRepository.findOne({
      where: {
        id: dto.movie_id,
      },
    });

    if (!studio || !movie) throw new NotFoundException('Data not found');

    newSchedule.movieId = movie;
    newSchedule.studioId = studio;
    newSchedule.startTime = dto.start_time;
    newSchedule.endTime = dto.end_time;
    newSchedule.price = dto.price;
    newSchedule.date = dto.date;

    newSchedule.created_at = generateDateNow();
    newSchedule.updated_at = generateDateNow();

    await this.scheduleRepository.save(newSchedule);

    return {
      data: newSchedule,
      message: 'Add new schedule successfully',
    };
  }

  async getNowSchedule() {
    const dateNow = new Date().toISOString().split('T')[0];

    //* Inner join 3 table with like criteria
    const schedule = await this.scheduleRepository
      .createQueryBuilder('movie_schedules')
      .where('movie_schedules.date like :date', { date: `${dateNow}%` })
      .innerJoinAndSelect('movie_schedules.movieId', 'movies')
      .innerJoinAndSelect('movie_schedules.studioId', 'studios')
      .getMany();

    return {
      data: schedule,
      message: 'Get now movie schedule successfully',
    };
  }

  //* Run this function every 2 hours
  @Cron(CronExpression.EVERY_2_HOURS, { name: 'Get all movie schedules' })
  async getAllSchedule() {
    const allSchedules = await this.scheduleRepository.find();
    Logger.log('Get all movie schedule . . .');
    console.log(allSchedules);
  }
}
