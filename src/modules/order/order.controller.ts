import {Body, Controller, HttpCode, HttpException, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {OrderService} from "@modules/order/order.service";
import {AuthGuard} from "@common/guards/auth.guard";
import RoleGuard from "@common/guards/roles.guard";
import Role from "@common/enums/role.enum";

import {CreateOrderDto} from "@modules/order/dto/create-order.dto";
import {ProductService} from "@modules/product/product.service";
import {AccountDecorator} from "@common/decorators/account.decorator";
import {AccountDocument} from "@modules/account/schemas/account.schema";
import {WarrantyCenterService} from "@modules/warranty-center/warranty-center.service";
import * as moment from "moment";
import {DistributionAgentService} from "@modules/distribution-agent/distribution-agent.service";
import {CustomerService} from "@modules/customer/customer.service";

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService, private readonly customerService: CustomerService, private readonly distributionAgentService: DistributionAgentService, private readonly productService: ProductService, private readonly warrantyCenterService: WarrantyCenterService) {
  }

  @Post('distribution-agent/order')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.DistributionAgent))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto, @AccountDecorator() account: AccountDocument) {

    const {data, paginationOptions} = await this.productService.findAll({
      status: 'distributed',
      _id: {$in: createOrderDto.orderProducts},
      distributedBy: account.belongTo,
    })


    if (paginationOptions.totalDocs < createOrderDto.orderProducts.length) {
      throw new HttpException(`Can't create order`, HttpStatus.BAD_REQUEST)
    }
    let customer;
    try {
      customer = await this.customerService.findOne({
        phoneNumber: createOrderDto.phoneNumber,
        address: createOrderDto.address,
        name: createOrderDto.customerName
      })

    } catch (e: any) {
      customer = await this.customerService.create({
        phoneNumber: createOrderDto.phoneNumber,
        address: createOrderDto.address,
        name: createOrderDto.customerName
      })
    }

    const newOrder = await this.orderService.create({
      customer: customer,
      orderItems: createOrderDto.orderProducts
    }, {});

    const distributionAgent = await this.distributionAgentService.findOne({_id: account.belongTo})
    const warrantyExpires = moment().add(1, 'years').utcOffset('+0700').toDate()
    for (const ele of data) {
      ele.status = 'sold'
      ele.order = newOrder;
      ele.warrantyExpiresAt = warrantyExpires;
      ele.history.push({
        createdAt: moment().utcOffset('+0700').format('YYYY-MM-DD HH:mm'),
        type: 'sold',
        from: distributionAgent.name,
        to: customer.name
      })
      ele.currentlyBelong = customer._id
      ele.belongToWarehouse = null
      ele.currentlyBelongModel = 'Customer'

      await ele.save()
    }
    await newOrder.populate([{
      model: 'Customer',
      path: 'customer',
    }, {model: 'Product', path: 'orderItems'}])
    return {
      success: true,
      data: newOrder
    }
  }
}
