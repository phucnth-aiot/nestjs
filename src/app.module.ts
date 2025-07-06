import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { typeOrmConfig } from './config/database.config';
import { UserModule } from './domain/users/users.module';
import { AuthModule } from './domain/auth/auth.module';
import { TaskModule } from './domain/task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...typeOrmConfig(configService),
      }),
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
})
export class AppModule {}
