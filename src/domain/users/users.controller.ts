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
import { JwtPayload } from '../auth/dto/jwt-payload.interface';

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
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  async findOne(@Param('id') id: string, @Request() req: { user: JwtPayload }) {
    try {
      const userId = req.user.sub;
      if (userId !== id && req.user.role !== Role.Admin) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
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
  @Get('me')
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({ status: 200, description: 'User info retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: { user: JwtPayload },
  ) {
    try {
      const userId = req.user.sub;
      if (userId !== id && req.user.role !== Role.Admin) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
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

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
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
