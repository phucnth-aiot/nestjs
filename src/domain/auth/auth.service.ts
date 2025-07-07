import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from './dto/user-response.dto';

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...result } = user;
    return result as UserResponseDto;
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

    return { access_token, refresh_token };
  }

  async register(dto: RegisterDto) {
    const existing = await this.userService.findOne(dto.phone);
    if (existing) throw new ConflictException('Phone number already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    });
    return user;
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
}
