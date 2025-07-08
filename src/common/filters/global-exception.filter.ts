<<<<<<< HEAD
import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
=======
import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { randomUUID } from 'crypto';
>>>>>>> e54643e (feat: add.)

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
<<<<<<< HEAD
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    res.status(status).json({
      statusCode: status,
      message,
      path: req.url,
      method: req.method,
=======
    const status = 500;

    res.status(status).json({
      statusCode: status,
      message: exception.message as string,
      path: req.url,
      method: req.method,
      traceId: randomUUID(),
>>>>>>> e54643e (feat: add.)
    });
  }
}
