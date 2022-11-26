import {Injectable} from "@nestjs/common";
import {TokenDocument} from "@modules/tokens/schema/token.schema";
import {InjectModel} from "@nestjs/mongoose";
import {FilterQuery, PaginateModel, QueryOptions} from "mongoose";

@Injectable()
export class TokensService {

  constructor(@InjectModel("Token") private tokenModel: PaginateModel<TokenDocument>) {
  }

  async create(token: Partial<TokenDocument>) {
    return await this.tokenModel.create(token);
  }

  async findOne(filter: FilterQuery<TokenDocument>, options?: QueryOptions) {
    return this.tokenModel.findOne(filter, options);
  }

  async deleteOne(filter: FilterQuery<TokenDocument>, options?: QueryOptions) {
    return this.tokenModel.findOneAndDelete(filter, options);
  }

  async count(filter: FilterQuery<TokenDocument>) {
    return this.tokenModel.countDocuments(filter);
  }
}
