import {Injectable} from '@nestjs/common';
import {CreateWarehouseDto} from './dto/create-warehouse.dto';
import {UpdateWarehouseDto} from './dto/update-warehouse.dto';
import {BaseService} from "@common/service/base.service";
import {WarehouseDocument} from "@modules/warehouse/schemas/warehouse.schema";
import {InjectModel} from "@nestjs/mongoose";
import {PaginateModel} from "mongoose";

@Injectable()
export class WarehouseService extends BaseService<WarehouseDocument> {
  constructor(@InjectModel('Warehouse') warehouseModel: PaginateModel<WarehouseDocument>) {
    super(warehouseModel);
  }
}
