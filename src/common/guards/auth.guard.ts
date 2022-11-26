import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthService } from "@modules/auth/auth.service";

import { getTokenFromRequest } from "@src/utils/get-token-from-request";
import {AccountsService} from "@modules/account/accounts.service";


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private accountService: AccountsService) {
  }

  async canActivate(
    context: ExecutionContext
  ) {

    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const token = getTokenFromRequest(req);

    if (!token) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    req.account = await this.authService.verifyTokenFromRequest(token, "jwt.accessTokenPrivateKey");
    return true;
  }
}
