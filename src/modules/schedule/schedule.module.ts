import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MovieSchedule } from 'src/entities/movie-schedule.entity';
import { Studio } from 'src/entities/movie-studio.entity';
import { Movie } from 'src/entities/movie.entity';
import { AuthorizeMiddleware } from 'src/middleware/authorize';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [TypeOrmModule.forFeature([MovieSchedule, Studio, Movie])],
  controllers: [ScheduleController],
  providers: [AuthorizeMiddleware, ScheduleService],
})
export class MovieScheduleModule {}
