import { Controller, Get, Req } from '@nestjs/common';

import { AppService } from './app.service';
import { IpLogger } from './middleware/ip-logger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/api')
  getHello(@Req() req: any): string {
    IpLogger(req);
    return this.appService.getHello();
  }
}
