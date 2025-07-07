import { Controller, Get, Post, Put, Param, Delete, Body, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dtos';
import { UserUpdateDto } from './dtos/user-update.dtos';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
// import { UserDeleteDto } from './dtos/user-delete.dtos';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get()
  findall() {
    return this.UserService.findAll();
  }
  @Get(':id')
  findById(@Param(':id') id: string) {
    return this.UserService.findById(id);
  }

  @Post()
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.UserService.create(CreateUserDto);
  }

  @Put(':userid')
  update(@Param('userid') userid: string, @Body() UserUpdateDto: UserUpdateDto) {
    return this.UserService.update(userid, UserUpdateDto);
  }

  @Delete('userid')
  delete(@Param('userid') @Body() userid: string) {
    return this.UserService.delete(userid);
  }
}
