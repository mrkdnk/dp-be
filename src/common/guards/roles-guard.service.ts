// import { ROLE_KEY } from '../../users/decorators/roles.decorator';
// import { Role } from '../../users/enums/role.enum';

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ROLE_KEY } from '../../users/decorators/roles.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(ROLE_KEY, context.getHandler());
    if (!roles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return roles.includes(user.role);
  }
}

// @Injectable()
// export class RolesGuard implements CanActivate {
//
//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     console.log('requiredRoles', requiredRoles);
//     if (!requiredRoles) {
//       return true;
//     }
//     const { user } = context.switchToHttp().getRequest();
//
//     console.log('user', user);
//     return true;
//     // return requiredRoles.includes(user.role);
//   }
// }
