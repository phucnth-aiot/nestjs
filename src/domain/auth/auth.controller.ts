import { Controller, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './jwt-auth/jwt-authlocal.guard';
import { refreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from '../users/dtos/create-user.dtos';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const user = await this.authService.register(dto);
    return { message: 'User registered successfully', user };
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh/:id')
  async refresh(@Param('id') id: string, @Body() body: refreshTokenDto) {
    return await this.authService.refreshToken(id, body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout/:id')
  async logout(@Param('id') id: string) {
    return this.authService.logout(id);
  }
}
