import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/users.module';
import { JwtStrategy } from './jwt-auth/jwt-auth.strategy';
import { AuthLocal } from './jwt-auth/jwt-authLocal';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthLocal],
  exports: [AuthService],
})
export class AuthModule {}
