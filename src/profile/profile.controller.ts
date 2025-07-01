import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/users.entity';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('profile')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfileController {
  @Get('admin')
  @Roles(UserRole.ADMIN)
  getAdminProfile(@Request() req: RequestWithUser) {
    return {
      message: 'Only admin can see this!',
      user: req.user,
    };
  }

  @Get('me')
  getMyProfile(@Request() req: RequestWithUser) {
    return {
      message: 'Your profile data',
      user: req.user,
    };
  }
}
