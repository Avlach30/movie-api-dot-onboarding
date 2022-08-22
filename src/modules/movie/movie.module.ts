import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MovieSchedule } from 'src/entities/movie-schedule.entity';
import { Studio } from 'src/entities/movie-studio.entity';
import { Movie } from '../../entities/movie.entity';
import { MovieTag } from '../../entities/movie-tag.entity';
import { Tag } from '../../entities/tag.entity';
import { AuthorizeMiddleware } from '../../middleware/authorize';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, Tag, MovieTag, Studio, MovieSchedule]),
    MulterModule.register({
      dest: './assets/movie-poster',
    }),
  ],
  controllers: [MovieController],
  providers: [AuthorizeMiddleware, MovieService],
})
export class MovieModule {}
