import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpMiddleware implements NestMiddleware {
  use(req: Request & { clientIp?: string }, res: Response, next: NextFunction) {
    const xForwardedFor = req.headers['x-forwarded-for'];
    const remoteAddress = req.socket.remoteAddress;

    let ip = '';

    if (typeof xForwardedFor === 'string') {
      ip = xForwardedFor.split(',')[0].trim();
    } else if (Array.isArray(xForwardedFor)) {
      ip = xForwardedFor[0];
    } else if (remoteAddress) {
      ip = remoteAddress;
    }

    // Chuyển IPv6 localhost (::1) về IPv4
    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
      ip = '127.0.0.1';
    }

    req.clientIp = ip;
    next();
  }
}
