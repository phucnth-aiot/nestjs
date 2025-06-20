import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'mysql', // <- Sửa lại
    host: configService.get<string>('DB_HOST') || 'localhost',
    port: parseInt(configService.get<string>('DB_PORT') || '3306', 10),
    username: configService.get<string>('DB_USERNAME') || 'root',
    password: configService.get<string>('DB_PASSWORD') || '',
    database: configService.get<string>('DB_NAME') || 'employee_management',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize:
      (configService.get<string>('NODE_ENV') || 'development') !== 'production',
    logging:
      (configService.get<string>('NODE_ENV') || 'development') == 'development',
  };
};
