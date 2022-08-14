import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Studio } from 'src/entities/movie-studio.entity';
import { AuthorizeMiddleware } from 'src/middleware/authorize';
import { StudioService } from './studio.service';
import { StudioController } from './studio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Studio])],
  controllers: [StudioController],
  providers: [AuthorizeMiddleware, StudioService],
})
export class StudioModule {}
