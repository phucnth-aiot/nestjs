import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { Request } from 'express';
import { JwtPayload } from 'src/common/share/jwt-payload.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireRole = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayload;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (!requireRole.includes(user.role)) {
      throw new ForbiddenException(`Access denied for role ${user.role}`);
    }

    return true;
  }
}
