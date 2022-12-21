import {Injectable} from '@nestjs/common';
import {BaseService} from "@common/service/base.service";
import {CustomerDocument} from "@modules/customer/schemas/customer.schema";
import {InjectModel} from "@nestjs/mongoose";
import {PaginateModel} from "mongoose";

@Injectable()
export class CustomerService extends BaseService<CustomerDocument> {
  constructor(@InjectModel('Customer') private readonly customerModel: PaginateModel<CustomerDocument>) {
    super(customerModel);
  }
}
