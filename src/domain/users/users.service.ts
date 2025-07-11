import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/users.entity';
import { UpdateUserDto } from './dto/user-update.dtos';
import { UserResponseDto } from '../auth/dto/user-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    return users.map((user) => ({
      userid: user.userid,
      username: user.username,
      phone: user.phone,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    }));
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { userid: id } });
    if (!user) {
      throw new NotFoundException('User not found');
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

  async findOne(phone: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { phone } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { userid: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Kiểm tra trùng phone hoặc email (nếu được cập nhật)
    if (updateUserDto.phone || updateUserDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: [
          updateUserDto.phone ? { phone: updateUserDto.phone } : {},
          updateUserDto.email ? { email: updateUserDto.email } : {},
        ],
      });
      if (existingUser && existingUser.userid !== id) {
        throw new ConflictException('Phone number or email already registered');
      }
    }

    // Hash password nếu được cung cấp
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Cập nhật user
    Object.assign(user, updateUserDto);
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

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { userid: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(id);
  }
}
