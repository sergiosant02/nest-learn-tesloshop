import { SetMetadata } from '@nestjs/common';

export const ROLE_LABEL = 'role';

export const RoleGuard = (...roles: string[]) => {
  return SetMetadata(ROLE_LABEL, roles);
};
