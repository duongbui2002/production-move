import {Injectable} from '@nestjs/common';
import {BaseService} from "@common/service/base.service";
import {ProductDocument} from "@modules/product/schemas/product.schema";
import {InjectModel} from "@nestjs/mongoose";
import {PaginateModel} from "mongoose";
import {FactoryDocument} from "@modules/factory/schemas/factory.schema";
import * as mongoose from "mongoose";

@Injectable()
export class ProductService extends BaseService<ProductDocument> {
  constructor(@InjectModel('Product') private readonly productModel: PaginateModel<ProductDocument>) {
    super(productModel);
  }

  async aggregate(pipeline: mongoose.PipelineStage[], options?: mongoose.AggregateOptions) {

    const data = await this.productModel.aggregate(pipeline, options);
    return data
  }
}
