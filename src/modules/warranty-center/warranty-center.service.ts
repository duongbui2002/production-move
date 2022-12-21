import {Injectable} from '@nestjs/common';
import {BaseService} from "@common/service/base.service";
import {WarrantyCenterDocument} from "@modules/warranty-center/schemas/warranty-center.schema";
import {InjectModel} from "@nestjs/mongoose";
import {PaginateModel} from "mongoose";

@Injectable()
export class WarrantyCenterService extends BaseService<WarrantyCenterDocument> {
  constructor(@InjectModel('WarrantyCenter') warrantyCenterModel: PaginateModel<WarrantyCenterDocument>) {
    super(warrantyCenterModel);
  }
}
