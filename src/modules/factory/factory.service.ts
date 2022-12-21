import {Injectable} from '@nestjs/common';
import {BaseService} from "@common/service/base.service";
import {FactoryDocument} from "@modules/factory/schemas/factory.schema";
import {InjectModel} from "@nestjs/mongoose";
import {PaginateModel} from "mongoose";

@Injectable()
export class FactoryService extends BaseService<FactoryDocument> {
  constructor(@InjectModel('Factory') private factoryModel: PaginateModel<FactoryDocument>) {
    super(factoryModel);
  }
}
