import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  Res,
  UseGuards, Req
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {RegisterAccountDto} from "@modules/auth/dto/register-account.dto";
import {AccountsService} from "@modules/account/accounts.service";
import {TokensService} from "@modules/tokens/tokens.service";
import {LoginDto} from "@modules/auth/dto/login.dto";
import {AuthGuard} from "@common/guards/auth.guard";
import RoleGuard from "@common/guards/roles.guard";
import Role from "@common/enums/role.enum";


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly accountsService: AccountsService, private tokenService: TokensService) {
  }

  // @UseGuards(AuthGuard)
  // @UseGuards(RoleGuard(Role.ExecutiveBoard))
  @Post("register")
  async register(@Body() registerAccountDto: RegisterAccountDto) {
    await this.accountsService.create(registerAccountDto)
    return {
      message: "Register account successfully.",
      success: true
    };
  }


  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    const account = await this.authService.authenticate(loginDto.loginField, loginDto.password);
    if (!account) {
      throw new HttpException("Login failed", HttpStatus.NOT_FOUND);
    }

    const payload = {
      accountId: account._id
    };
    let {access_token, refresh_token} = this.authService.generateAuthTokens(payload);

    let {
      accessTokenExpiresAt, refreshTokenExpiresAt
    } = await this.authService.generateTokenExpiresTimes();

    await this.tokenService.create({
      token: refresh_token,
      account,
      expiresAt: refreshTokenExpiresAt,
      type: "refresh"
    });

    return {
      access_token,
      access_token_expires_at: accessTokenExpiresAt,
      refresh_token,
      account,
      success: true
    };
  }


  @Post("logout")
  @UseGuards(AuthGuard)
  async logout(@Req() req, @Res() res) {

    const refresh_token = req.body.refresh_token;
    if (!refresh_token) {
      throw new HttpException("Refresh token does not provided", HttpStatus.BAD_REQUEST);
    }

    await this.tokenService.deleteOne({token: refresh_token});

    return res.status(HttpStatus.OK).json({
      message: "Log out successfully",
      success: true
    });
  }
}
