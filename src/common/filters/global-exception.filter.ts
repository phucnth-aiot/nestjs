import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common"; 
import { randomUUID, } from "crypto";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const res = ctx.getResponse();
      const req = ctx.getRequest();
      const status = exception.status || 500;
      
      res.status(status).json({
        statusCode: status,
        message: exception.message,
        path: req.url,
        method: req.method,
        traceid: randomUUID()
      });
  }
}