import { Logger } from '@nestjs/common';
import * as requestIp from 'request-ip';

export const IpLogger = (req: any) => {
  return Logger.log(`Hello!, your ip address is ${requestIp.getClientIp(req)}`);
};
