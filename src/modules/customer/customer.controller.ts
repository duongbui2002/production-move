import {Body, Controller, Delete, Get, Param, Patch, Query} from '@nestjs/common';
import {CustomerService} from "@modules/customer/customer.service";
import {PaginationParamsDto} from "@common/dto/pagination-params.dto";
import {UpdateCustomerDto} from "@modules/customer/dto/update-customer.dto";

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

  @Patch(":id")
  async UpdateCustomer(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    const data = await this.customerService.update({_id: id}, updateCustomerDto, {new: true})
    return {
      data,
      success: true
    }
  }

  @Delete(":id")
  async deleteCustomer(@Param('id') id: string) {
    const data = await this.customerService.remove({_id: id})
    return {
      data,
      success: true
    }
  }
}
