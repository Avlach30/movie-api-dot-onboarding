import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AddMovieStudioDto } from 'src/dto/addNewStudio.dto';
import { IpLogger } from 'src/utils/ip-logger';
import { StudioService } from './studio.service';

@Controller('api')
@UseGuards(AuthGuard('jwt'))
export class StudioController {
  constructor(private readonly studioService: StudioService) {}

  @Post('studios')
  @HttpCode(201)
  async addStudio(@Body() dto: AddMovieStudioDto, @Req() req: any) {
    IpLogger(req);
    return await this.studioService.addStudio(dto);
  }
}
