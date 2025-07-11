import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/entities/users.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dtos';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtPayload } from './dto/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { phone: loginDto.phone } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      userid: user.userid,
      username: user.username,
      phone: user.phone,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const payload: JwtPayload = {
      sub: user.userid,
      username: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'access_secret',
      expiresIn: '15m',
    });

    const refreshToken = await this.generateRefreshToken(user);

    return {
      user_id: user.userid,
      access_token: accessToken,
      refresh_token: refreshToken.token,
      expires_in: 900, // 15 minutes
    };
  }

  async register(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [{ phone: dto.phone }, { email: dto.email }],
    });
    if (existingUser) {
      throw new ConflictException('Phone number or email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return {
      userid: user.userid,
      username: user.username,
      phone: user.phone,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    };
  }

  async refreshToken(refreshToken: string) {
    const tokenRecord = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (tokenRecord.expiresAt < new Date()) {
      await this.refreshTokenRepository.delete({ id: tokenRecord.id });
      throw new UnauthorizedException('Refresh token has expired');
    }

    try {
      const payload: JwtPayload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      });

      const user = await this.userRepository.findOne({
        where: { userid: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newAccessToken = this.jwtService.sign(
        { sub: user.userid, username: user.username, role: user.role },
        { secret: process.env.JWT_ACCESS_SECRET || 'access_secret', expiresIn: '15m' },
      );

      const newRefreshToken = await this.generateRefreshToken({
        userid: user.userid,
        username: user.username,
        phone: user.phone,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      });

      await this.refreshTokenRepository.delete({ id: tokenRecord.id });

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken.token,
        expires_in: 900, // 15 minutes
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async generateRefreshToken(user: UserResponseDto): Promise<RefreshToken> {
    const payload: JwtPayload = { sub: user.userid, username: user.username, role: user.role };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      expiresIn: '7d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const userEntity = await this.userRepository.findOne({ where: { userid: user.userid } });
    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    const refreshToken = this.refreshTokenRepository.create({
      token,
      user: userEntity,
      expiresAt,
    });

    await this.refreshTokenRepository.save(refreshToken);
    return refreshToken;
  }

  async logout(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { userid: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.refreshTokenRepository.delete({ user: { userid: userId } });
  }
}
