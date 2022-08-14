import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AddMovieScheduleDto } from 'src/dto/add-new-schedule.dto';
import { IpLogger } from 'src/utils/ip-logger';
import { ScheduleService } from './schedule.service';

@Controller('api')
@UseGuards(AuthGuard('jwt'))
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('now-playing')
  @HttpCode(200)
  async getNowSchedule(@Req() req: any) {
    IpLogger(req);
    return await this.scheduleService.getNowSchedule();
  }

  @Post('schedules')
  @HttpCode(201)
  async addNewSchedule(@Body() dto: AddMovieScheduleDto, @Req() req: any) {
    IpLogger(req);
    return await this.scheduleService.addNewSchedule(dto);
  }
}
