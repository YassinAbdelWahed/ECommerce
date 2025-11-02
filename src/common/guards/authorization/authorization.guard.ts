import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { roleName } from 'src/common/decorators';
import { RoleEnum } from 'src/common/enums';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const accessRole: RoleEnum[] =
      this.reflector.getAllAndOverride<RoleEnum[]>(roleName, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    // console.log(context, tokenType);

    let role: RoleEnum = RoleEnum.user;

    switch (context.getType()) {
      case 'http':
        role = context.switchToHttp().getRequest().credentials.user.role;
        break;

      // case 'rpc':
      //   const rpcCtx = context.switchToRpc();
      //   break;

      // case 'ws':
      //   const WSCtx = context.switchToWs();
      //   break;

      default:
        break;
    }
    console.log({ accessRole, role });

    return accessRole.includes(role);
  }
}
