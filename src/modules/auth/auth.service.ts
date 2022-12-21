import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {compareSync} from "bcryptjs";
import {ConfigService} from "@nestjs/config";
import {AccountsService} from "@modules/account/accounts.service";
import * as jwt from "jsonwebtoken";
import {AccountDocument} from "@modules/account/schemas/account.schema";
import TokenEnum from "@common/enums/token.enum";
import * as moment from "moment";

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService, private accountService: AccountsService) {
  }

  async authenticate(loginField: string, password: string) {
    let account = await this.accountService.findOne({$or: [{email: loginField}, {username: loginField}]}, {
      select: "username password email isActivated"
    });


    const check = await this.comparePassword(password, account.password);
    if (!account || !check) {
      throw new HttpException("Failed to login", HttpStatus.UNAUTHORIZED);
    }

    account = await this.accountService.findOne({_id: account._id});
    return account;
  }


  async comparePassword(password: string, storePasswordHash: string): Promise<boolean> {
    return compareSync(password, storePasswordHash);
  }

  generateToken(payload: any, keyName: "jwt.accessTokenPrivateKey" | "jwt.refreshTokenPrivateKey", options?: jwt.SignOptions) {
    const privateKeyBase64 = this.configService.get(keyName);
    const privateKey = Buffer.from(privateKeyBase64, "base64").toString("ascii");
    return jwt.sign(payload, privateKey, {
      algorithm: "HS256",
      ...options
    });
  }


  verifyToken(token: string, keyName: "jwt.accessTokenPrivateKey" | "jwt.refreshTokenPrivateKey"): any {

    const privateKeyBase64 = this.configService.get(keyName);
    const privateKey = Buffer.from(privateKeyBase64, "base64").toString("ascii");
    return jwt.verify(token, privateKey);

  }

  async verifyTokenFromRequest(token: string, keyName: "jwt.accessTokenPrivateKey" | "jwt.refreshTokenPrivateKey"): Promise<AccountDocument> {
    const payload = this.verifyToken(token, "jwt.accessTokenPrivateKey");
    const {accountId} = payload;
    const account = await this.accountService.findOne({_id: accountId}, {});

    if (!account) {
      throw new HttpException("Account does not exist", HttpStatus.UNAUTHORIZED);
    }
    return account;
  }


  generateAuthTokens(payload: any) {
    const access_token = this.generateToken(payload, "jwt.accessTokenPrivateKey", {expiresIn: this.configService.get("jwt.expiresTime.access")});
    const refresh_token = this.generateToken({
      ...payload,
      type: "refresh"
    }, "jwt.refreshTokenPrivateKey", {expiresIn: this.configService.get("jwt.expiresTime.refresh")});

    return {
      access_token,
      refresh_token
    };
  }

  async generateTokenExpiresTimes(type?: string) {
    const expiresTime = {};

    for (const type in TokenEnum) {
      expiresTime[TokenEnum[type]] = moment().add(
        parseInt(this.configService.get(`jwt.expiresTime.${TokenEnum[type]}`).match(/\d+/)[0]),
        this.configService.get(`jwt.expiresTime.${TokenEnum[type]}`).replace(/[^A-Za-z]/g, '')
      ).toDate();
    }


    return (type) ? expiresTime[type] : {
      accessTokenExpiresAt: expiresTime[TokenEnum.Access],
      refreshTokenExpiresAt: expiresTime[TokenEnum.Refresh],
      emailVerifyTokenExpiresAt: expiresTime[TokenEnum.EmailVerify],
      changePasswordTokenExpiresAt: expiresTime[TokenEnum.ChangePassword],
      success: true
    };
  }
}
