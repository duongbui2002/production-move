import {Injectable} from '@nestjs/common';
import {BaseService} from "@common/service/base.service";
import {OrderDocument} from "@modules/order/schemas/order.schema";
import {InjectModel} from "@nestjs/mongoose";
import {PaginateModel} from "mongoose";

@Injectable()
export class OrderService extends BaseService<OrderDocument> {
  constructor(@InjectModel('Order') orderModel: PaginateModel<OrderDocument>) {
    super(orderModel);
  }
}
