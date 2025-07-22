import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { typeOrmConfig } from './config/database.config';
import { UserModule } from './domain/users/users.module';
import { AuthModule } from './domain/auth/auth.module';
import { TaskModule } from './domain/task/task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { IpMiddleware } from './common/middleware/ip.middleware';
import { AuditLogModule } from './domain/auditLog/audit-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        ...typeOrmConfig(),
      }),
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          host: 'localhost',
          port: 6379,
        }),
        ttl: 1800, // time default : 30m
      }),
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    TaskModule,
    AuditLogModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpMiddleware).forRoutes('*'); // use for all route
  }
}
