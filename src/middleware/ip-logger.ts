import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import * as requestIp from 'request-ip';

@Injectable()
//* Create custom middleware
export class IpLoggerMidlleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    Logger.log(`Hello!, your ip address is ${requestIp.getClientIp(req)}`);
    next();
  }
}
