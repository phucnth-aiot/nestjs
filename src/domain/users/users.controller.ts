import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  HttpException,
  Request,
} from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/user-update.dtos';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';
import { RoleGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtPayload } from '../../common/share/jwt-payload.interface';
import UserChangePasswordDto from './dto/user-change-password';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Get()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  async findAll() {
    try {
      const users = await this.userService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve users';
      const status = error instanceof HttpException ? error.getStatus() : HttpStatus.BAD_REQUEST;
      throw new HttpException(message, status);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.findById(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve user';
      const status = error instanceof HttpException ? error.getStatus() : HttpStatus.BAD_REQUEST;
      throw new HttpException(message, status);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({ status: 200, description: 'User info retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get('me')
  async getMe(@Request() req: { user: JwtPayload }) {
    try {
      const user = await this.userService.findById(req.user.sub);
      return {
        statusCode: HttpStatus.OK,
        message: 'User info retrieved successfully',
        data: user,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve user info';
      const status = error instanceof HttpException ? error.getStatus() : HttpStatus.BAD_REQUEST;
      throw new HttpException(message, status);
    }
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userService.update(id, updateUserDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: user,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update user';
      const status = error instanceof HttpException ? error.getStatus() : HttpStatus.BAD_REQUEST;
      throw new HttpException(message, status);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @Patch('changePassword/:id')
  async changePassword(@Param('id') id: string, @Body() body: UserChangePasswordDto) {
    try {
      const { oldPassword, newPassword } = body;
      const user = await this.userService.changePassword(id, oldPassword, newPassword);
      return {
        statusCode: HttpStatus.OK,
        message: 'Change password successfully',
        data: user,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to change password';
      const status = error instanceof HttpException ? error.getStatus() : HttpStatus.BAD_REQUEST;
      throw new HttpException(message, status);
    }
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.userService.remove(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete user';
      const status = error instanceof HttpException ? error.getStatus() : HttpStatus.BAD_REQUEST;
      throw new HttpException(message, status);
    }
  }
}
