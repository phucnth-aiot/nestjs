import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpException,
  Res,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dtos';
// import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { EmailVerificationService } from './email-verification.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailVerificationService: EmailVerificationService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Phone number or email already registered' })
  async register(@Body() dto: CreateUserDto) {
    try {
      const code = await this.emailVerificationService.generateCode(dto.email, dto.phone);
      await this.emailVerificationService.sendCode(dto.email, code);
      // const user = await this.authService.register(dto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Verification code sent to email',
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      const status = error instanceof HttpException ? error.getStatus() : HttpStatus.BAD_REQUEST;
      throw new HttpException(message, status);
    }
  }

  @Post('register/confirm')
  async confirmRegister(@Body() dto: CreateUserDto & { code: string }) {
    const isValid = this.emailVerificationService.validateCode(dto.email, dto.code);
    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    }

    const user = await this.authService.register(dto); // Lưu user vào DB
    this.emailVerificationService.removeCode(dto.email);

    return {
      statusCode: 201,
      message: 'User registered successfully',
      data: user,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and return tokens' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    try {
      const result = await this.authService.login(loginDto);

      // Set refresh token cookie (7 days)
      res.cookie('refresh_token', result.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Set access token cookie (15 mins)
      res.cookie('access_token', result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        data: {
          user: result.user_info,
          expires_in: result.expires_in / 60, // minutes
          access_token: result.access_token,
        },
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
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const refreshToken = (req.cookies as { refresh_token?: string })?.refresh_token;

      if (!refreshToken) {
        throw new HttpException('Refresh token not found', HttpStatus.UNAUTHORIZED);
      }

      const tokens = await this.authService.refreshToken(refreshToken);

      // set new access token
      res.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      // update refresh_token cookie if rotated
      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Token refreshed successfully',
        data: {
          expires_in: tokens.expires_in / 60,
        },
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
  async logout(@Body() body: { userId: string }, @Res({ passthrough: true }) res: Response) {
    try {
      await this.authService.logout(body.userId);

      // clear cookies
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

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
