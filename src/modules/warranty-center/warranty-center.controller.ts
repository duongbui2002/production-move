import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from "@common/guards/auth.guard";
import RoleGuard from "@common/guards/roles.guard";
import Role from "@common/enums/role.enum";

import {WarrantyCenterService} from "@modules/warranty-center/warranty-center.service";
import {CreateWarrantyCenterDto} from "@modules/warranty-center/dto/create-warranty-center.dto";
import {HandleWarrantyDto} from "@modules/warranty-center/dto/handle-warranty.dto";
import {AccountDecorator} from "@common/decorators/account.decorator";
import {AccountDocument} from "@modules/account/schemas/account.schema";
import {WarrantyService} from "@modules/warranty/warranty.service";
import {PaginationParamsDto} from "@common/dto/pagination-params.dto";
import {ProductService} from "@modules/product/product.service";

@Controller('warranty-center')
export class WarrantyCenterController {
  constructor(private readonly warrantyCenterService: WarrantyCenterService, private readonly warrantyService: WarrantyService, private readonly productService: ProductService) {
  }

  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.ExecutiveBoard))
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createWarrantyCenterDto: CreateWarrantyCenterDto) {
    const newData = await this.warrantyCenterService.create(createWarrantyCenterDto)
    return {
      data: newData,
      success: true
    }
  }


  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.WarrantyCenter))
  @Get('warranty-requests')
  async getAllWarranties(@AccountDecorator() account: AccountDocument, @Query() options: PaginationParamsDto) {


    const warrantyCenter = await this.warrantyCenterService.findOne({_id: account.belongTo})
    const {data, paginationOptions} = await this.warrantyService.findAll({warrantyCenter}, {
      populate: [{
        path: 'fromDistributionAgent',
        select: 'name address phoneNumber'
      }, {
        path: 'customer',
        select: 'name address phoneNumber'
      }, {path: 'warrantyCenter', select: 'name address phoneNumber'}, {
        path: 'products',
        populate: [{path: 'productLine'}]
      }]
    })

    return {
      data,
      paginationOptions
    }
  }


  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.WarrantyCenter))
  @Post('handle-warranty')
  async handleWarranty(@Body() handleWarrantyDto: HandleWarrantyDto) {
    const warranty = await this.warrantyService.findOne({
      _id: handleWarrantyDto.warranty
    })

    const {data, paginationOptions} = await this.productService.findAll({_id: {$in: warranty.products}})

    if (status === 'success') {

    } else if (status === 'failure'
    ) {

    }
  }
}
