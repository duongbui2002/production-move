import {Injectable} from '@nestjs/common';
import {BaseService} from "@common/service/base.service";
import {WarrantyDocument} from "@modules/warranty/schemas/warranty.schema";
import {InjectModel} from "@nestjs/mongoose";
import {PaginateModel} from "mongoose";

@Injectable()
export class WarrantyService extends BaseService<WarrantyDocument> {
  constructor(@InjectModel('Warranty') warrantyModel: PaginateModel<WarrantyDocument>) {
    super(warrantyModel);
  }

}
