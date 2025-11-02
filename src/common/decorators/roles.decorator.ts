import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../enums';

export const roleName = 'roles';
export const Roles = (type: RoleEnum[]) => {
  return SetMetadata(roleName, type);
};
