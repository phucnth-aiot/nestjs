import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from '../users/dtos/create-user.dtos';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<UserResponseDto> {
    const user = await this.userService.findOne(loginDto.phone);
    if (!user) throw new UnauthorizedException('user not found');

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('inlavid password');

    return user as UserResponseDto;
  }

  async login(user: UserResponseDto) {
    const payload = {
      sub: user.userid,
      username: user.username,
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.userService.updateRefreshToken(user.userid, refresh_token);

    return { user_id: user.userid, access_token, refresh_token };
  }

  async register(dto: CreateUserDto) {
    const existing = await this.userService.findOne(dto.phone);
    if (existing) throw new ConflictException('Phone number already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.userService.create({
      ...dto,
      password: hashedPassword,
    });
    return { message: 'Regiter succesfully' };
  }

  async refreshToken(userid: string, refreshToken: string) {
    const user = await this.userService.findById(userid);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = {
      sub: user.userid,
      username: user.username,
      role: user.role,
    };
    const newAccessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    return { access_token: newAccessToken };
  }

  async logout(userId: string): Promise<{ message: string }> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.refreshToken = '';
    await this.userService.create(user);

    return { message: 'Logout successful' };
  }
}
