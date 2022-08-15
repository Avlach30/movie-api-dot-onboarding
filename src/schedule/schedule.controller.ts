import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AddMovieScheduleDto } from 'src/dto/add-new-schedule.dto';
import { IpLogger } from 'src/middleware/ip-logger';
import { HttpExceptionFilter } from 'src/utils/responses/api-failed-response';
import { ResponseInterceptor } from 'src/utils/responses/api-success-response';
import { ScheduleService } from './schedule.service';

@Controller('api')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
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
