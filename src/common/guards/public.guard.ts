import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, mixin } from "@nestjs/common";
import { AuthService } from "@modules/auth/auth.service";
import { getTokenFromRequest } from "@src/utils/get-token-from-request";


@Injectable()
export class PublicGuard implements CanActivate {
  constructor(private authService: AuthService) {
  }

  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();

    const token = getTokenFromRequest(req);

    if (!token) {
      return true;
    }

    req.account = await this.authService.verifyTokenFromRequest(token, "jwt.accessTokenPrivateKey");
    return true;
  }
}
