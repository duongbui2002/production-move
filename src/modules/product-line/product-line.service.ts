import {Injectable} from '@nestjs/common';
import {BaseService} from "@common/service/base.service";
import {ProductLineDocument} from "@modules/product-line/schemas/product-line.schema";
import {InjectModel} from "@nestjs/mongoose";
import {PaginateModel} from "mongoose";

@Injectable()
export class ProductLineService extends BaseService<ProductLineDocument> {
  constructor(@InjectModel('ProductLine') productLineModel: PaginateModel<ProductLineDocument>) {
    super(productLineModel);
  }
}
