import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../interfaces/role.interface';
import { RoleGuard } from './role-guard.decorator';
import { UserRoleGuard } from './user-role.guard';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    RoleGuard(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
