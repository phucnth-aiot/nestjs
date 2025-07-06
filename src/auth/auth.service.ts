import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@/users/users.entity';
import { SafeUser } from './interfaces/safe-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<SafeUser | null> {
    const user = await this.userService.findOne(username);
    console.log('user from db', user);

    if (!user) {
      console.log('User not found');
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    console.log('bcrypt result', isMatch);

    if (isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...result } = user;
      return result as unknown as SafeUser;
    }
    return null;
  }

  login(user: SafeUser) {
    const payload = {
      username: user.username,
      sub: user.userId, // userId should be the unique identifier for the user
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, password: string, role: UserRole = UserRole.USER) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.userService.create({
      username,
      password: hashedPassword,
      role,
    });
    return user;
  }
}
