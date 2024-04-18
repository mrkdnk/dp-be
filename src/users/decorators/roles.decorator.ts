import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLE_KEY = 'role';
export const Roles = (...roles: Role[]) => {
  return SetMetadata(ROLE_KEY, roles);
};
