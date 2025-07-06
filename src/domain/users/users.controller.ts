import { Controller, Get, Post, Put, Param, Delete, Body, UseGuards } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from './dtos/create-user.dtos';
import { UserDto } from './dtos/user.dto';
import { UserUpdateDto } from './dtos/user-update.dtos';
import { AuthGuard } from "@nestjs/passport";
// import { RolesGuard } from "../auth/jwt-auth/jwt-role.guard";
import { JwtAuthGuard } from "../auth/jwt-auth/jwt-auth.guard";
// import { UserDeleteDto } from './dtos/user-delete.dtos';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService){}

  @Get()
  findall(){
    return this.UserService.findAll
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param(':id') id: string){
    return this.UserService.findById(id)
  }

  @Post()
  create(@Body() CreateUserDto: CreateUserDto){
    return this.UserService.create(CreateUserDto)
  }

  @Put(':userid')
  update(@Param('userid') userid:string, @Body() UserUpdateDto: UserUpdateDto){
    return this.UserService.update(userid, UserUpdateDto)
  }

  @Delete('userid')
  delete(@Param('userid') @Body() userid:string) {
    return this.UserService.delete(userid)
  }
}
