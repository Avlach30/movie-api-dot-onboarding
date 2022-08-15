import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AddMovieStudioDto } from 'src/dto/add-new-studio.dto';
import { HttpExceptionFilter } from 'src/utils/responses/api-failed-response';
import { ResponseInterceptor } from 'src/utils/responses/api-success-response';
import { StudioService } from './studio.service';

@Controller('api')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class StudioController {
  constructor(private readonly studioService: StudioService) {}

  @Post('studios')
  @HttpCode(201)
  async addStudio(@Body() dto: AddMovieStudioDto) {
    return await this.studioService.addStudio(dto);
  }
}
