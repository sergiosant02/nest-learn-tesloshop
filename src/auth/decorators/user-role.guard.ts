import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { ROLE_LABEL } from './role-guard.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const roles = this.reflector.get<string[]>(ROLE_LABEL, ctx.getHandler());
    const user: User = req.user;
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!roles || roles.length === 0) {
      return true;
    }
    for (const role of roles) {
      if (user.roles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(
      'You are not authorized to perform this action',
    );
  }
}
