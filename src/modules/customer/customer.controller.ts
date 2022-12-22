import {Controller, Get, Param, Query} from '@nestjs/common';
import {CustomerService} from "@modules/customer/customer.service";
import {PaginationParamsDto} from "@common/dto/pagination-params.dto";

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {
  }

  @Get()
  async getAllCustomer(@Query() options: PaginationParamsDto) {
    const {data, paginationOptions} = await this.customerService.findAll({}, options)
    return {
      data,
      paginationOptions
    }
  }

  @Get(":id")

  async getCustomerById(@Param('id') id: string) {
    const data = await this.customerService.findOne({_id: id})
    return {
      data,
      success: true
    }
  }
}
