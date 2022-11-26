import {CanActivate, ExecutionContext, mixin, Type} from "@nestjs/common";

import Role from "@common/enums/role.enum";

import {AuthGuard} from "@common/guards/auth.guard";


const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends AuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      const account = request.account;

      return account?.roles.includes(role);
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
