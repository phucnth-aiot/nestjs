import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { getDatabaseConfig } from './config/database.config';
import { UserModule } from './domain/users/users.module';
import { AuthModule } from './domain/auth/auth.module';
import { TaskModule } from './domain/task/task.module';

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

     CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          host: 'localhost',
          port: 6379,
        }),
        ttl: 1800, // thời gian cache mặc định: 60 giây
      }),
    }),
    UserModule,
    AuthModule,
    TaskModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
