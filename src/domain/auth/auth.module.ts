import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/users.module';
import { JwtStrategy } from './jwt-auth/jwt-auth.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { UserEntity } from '../users/entities/users.entity';
import { EmailVerificationService } from './email-verification.service';
import { AuditLogService } from '../auditLog/audit-log.service';
import { AuditLogEntity } from '../auditLog/entities/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RefreshToken, AuditLogEntity]),
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '15s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, EmailVerificationService, AuditLogService],
  exports: [AuthService],
})
export class AuthModule {}
