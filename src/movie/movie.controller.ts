import { extname } from 'path';

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';

import { MovieService } from './movie.service';
import { CreateMovieDto } from 'src/dto/createMovie.dto';
import { AddMovieStudioDto } from 'src/dto/addNewStudio.dto';
import { AddMovieScheduleDto } from 'src/dto/addNewSchedule.dto';
import { IpLogger } from 'src/utils/ip-logger';

@Controller('api/v1')
@UseGuards(AuthGuard('jwt'))
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('movies')
  @HttpCode(200)
  async fetchAllMovies(@Req() req: any) {
    IpLogger(req);
    return await this.movieService.getAllmovies();
  }

  @Get('movies/now_playing')
  @HttpCode(200)
  async getSchedule(@Req() req: any) {
    IpLogger(req);
    return await this.movieService.getSchedule();
  }

  @Post('backoffice/movies')
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './assets/movie-poster',
        filename(req, file, callback) {
          const fileExtName = extname(file.originalname);
          const newName = Date.now();
          callback(null, `image-${newName}${fileExtName}`);
        },
      }),
      fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
          return callback(
            new BadRequestException(
              'Sorry, only image files (jpg/jpeg) are allowed!',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @HttpCode(201)
  async createMovie(
    @Body() dto: CreateMovieDto,
    @UploadedFile() file,
    @Req() req: any,
  ) {
    IpLogger(req);
    return await this.movieService.createMovie(dto, file);
  }

  @Get('backoffice/movies')
  @HttpCode(200)
  async getAllMovies(@Req() req: any) {
    IpLogger(req);
    return await this.movieService.getAllmovies();
  }

  @Post('backoffice/movies/studios')
  @HttpCode(201)
  async addStudio(@Body() dto: AddMovieStudioDto, @Req() req: any) {
    IpLogger(req);
    return await this.movieService.addStudio(dto);
  }

  @Post('backoffice/movies/schedule')
  @HttpCode(201)
  async addNewSchedule(@Body() dto: AddMovieScheduleDto, @Req() req: any) {
    IpLogger(req);
    return await this.movieService.addNewSchedule(dto);
  }

  @Get('backoffice/tags')
  @HttpCode(200)
  async getAllTags(@Req() req: any) {
    IpLogger(req);
    return await this.movieService.getAllTags();
  }
}
