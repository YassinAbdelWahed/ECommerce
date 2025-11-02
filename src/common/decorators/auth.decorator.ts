import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleEnum, TokenEnum } from '../enums';
import { Token } from './tokenType.decorator';
import { Roles } from './roles.decorator';
import { AuthenticationGuard, AuthorizationGuard } from '../guards';

export function Auth(role: RoleEnum[], type: TokenEnum = TokenEnum.access) {
  return applyDecorators(
    Token(type),
    Roles(role),
    UseGuards(AuthenticationGuard, AuthorizationGuard),
  );
}
