import { Controller, Post, Body, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dtos';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Phone number or email already registered' })
  async register(@Body() dto: CreateUserDto) {
    try {
      const user = await this.authService.register(dto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: user,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      const status = error instanceof HttpException ? error.getStatus() : HttpStatus.BAD_REQUEST;
      throw new HttpException(message, status);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and return tokens' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        data: result,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid credentials';
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const tokens = await this.authService.refreshToken(refreshTokenDto.refreshToken);
      return {
        statusCode: HttpStatus.OK,
        message: 'Token refreshed successfully',
        data: tokens,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid or expired refresh token';
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout user and invalidate refresh tokens' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Body() body: { userId: string }) {
    try {
      await this.authService.logout(body.userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Logout successful',
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      const status = error instanceof HttpException ? error.getStatus() : HttpStatus.BAD_REQUEST;
      throw new HttpException(message, status);
    }
  }
}
