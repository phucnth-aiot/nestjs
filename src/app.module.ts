import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // ✅ Tự validate bằng code thường
        const required = (key: string) => {
          const value = configService.get<string>(key);
          if (value === undefined || value === null || value === '') {
            throw new Error(`Missing required environment variable: ${key}`);
          }
          return value;
        };
        return {
          type: 'mysql',
          host: required('DB_HOST'),
          port: parseInt(configService.get<string>('DB_PORT') || '3306'),
          username: required('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD') || '',
          database: required('DB_NAME'),
          synchronize: configService.get<string>('NODE_ENV') !== 'production',
          logging: configService.get<string>('NODE_ENV') === 'development',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
        };
      },
    }),
    AuthModule,
    UserModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
