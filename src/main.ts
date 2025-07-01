import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //lao bỏ các thuộc tính không được định nghĩa trong DTO
      forbidNonWhitelisted: true, //nếu có thuộc tính không được định nghĩa trong DTO thì sẽ trả về lỗi
      transform: true, //tự động chuyển đổi kiểu dữ liệu của các thuộc tính trong DTO
    }),
  );
  app.enableCors();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation available at: http://localhost:${port}/api`);
}
bootstrap();
