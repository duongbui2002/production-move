import {Injectable} from '@nestjs/common';
import {PaginateModel} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {AccountDocument} from "@modules/account/schemas/account.schema";
import {BaseService} from "@common/service/base.service";

@Injectable()
export class AccountsService extends BaseService<AccountDocument> {
  constructor(@InjectModel("Account") private accountModel: PaginateModel<AccountDocument>) {
    super(accountModel);
  }

  async create(account: Partial<AccountDocument>) {
    return await this.accountModel.create({
      email: account.email,
      username: account.username,
      password: account.password,
      belongTo: account.belongTo,
      displayName: account.displayName,
      belongToModel: account.belongToModel,
      roles: account.roles
    });
  }
}
