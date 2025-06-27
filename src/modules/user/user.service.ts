import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const hash: string = await bcrypt.hash(dto.password as string, 10);
    const user = this.userRepo.create({
      username: dto.username as string,
      password: hash,
    });
    await this.userRepo.save(user);
    return { message: 'User registered successfully' };
  }

  async login(username: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password ?? '');
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }
}
