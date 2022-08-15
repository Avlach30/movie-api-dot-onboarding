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
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';

import { MovieService } from './movie.service';
import { CreateMovieDto } from 'src/dto/create-movie.dto';
import { IpLogger } from 'src/middleware/ip-logger';
import { ResponseInterceptor } from 'src/utils/responses/api-success-response';
import { HttpExceptionFilter } from 'src/utils/responses/api-failed-response';

@Controller('api')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('movies')
  @HttpCode(200)
  async fetchAllMovies(@Req() req: any) {
    IpLogger(req);
    return await this.movieService.getAllmovies();
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

  @Get('backoffice/movies/tags')
  @HttpCode(200)
  async getAllTags(@Req() req: any) {
    IpLogger(req);
    return await this.movieService.getAllTags();
  }
}
