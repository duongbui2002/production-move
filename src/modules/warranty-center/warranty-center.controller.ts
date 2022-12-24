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
import {Model} from "@common/enums/common.enum";
import * as moment from "moment/moment";
import {DistributionAgentService} from "@modules/distribution-agent/distribution-agent.service";
import {WarrantyQueryDto} from "@modules/warranty-center/dto/warranty-query.dto";
import {ProductLineService} from "@modules/product-line/product-line.service";

@Controller('warranty-center')
export class WarrantyCenterController {
  constructor(private readonly warrantyCenterService: WarrantyCenterService,
              private readonly productLineService: ProductLineService,
              private readonly distributionAgentService: DistributionAgentService,
              private readonly warrantyService: WarrantyService,
              private readonly productService: ProductService) {
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


  // @UseGuards(AuthGuard)
  // @UseGuards(RoleGuard(Role.WarrantyCenter))
  // @Get('warranty-requests')
  // async getAllWarranties(@AccountDecorator() account: AccountDocument, @Query() options: PaginationParamsDto) {
  //   const warrantyCenter = await this.warrantyCenterService.findOne({_id: account.belongTo})
  //   const {data, paginationOptions} = await this.warrantyService.findAll({warrantyCenter}, {
  //     populate: [{
  //       path: 'fromDistributionAgent',
  //       select: 'name address phoneNumber'
  //     }, {
  //       path: 'customer',
  //       select: 'name address phoneNumber'
  //     }, {path: 'warrantyCenter', select: 'name address phoneNumber'}, {
  //       path: 'products',
  //       populate: [{path: 'productLine'}]
  //     }]
  //   })
  //
  //   return {
  //     data,
  //     paginationOptions
  //   }
  // }

  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.WarrantyCenter))
  @Post('handle-warranty')
  async handleWarranty(@Body() handleWarrantyDto: HandleWarrantyDto, @AccountDecorator() account: AccountDocument) {
    const warranty = await this.warrantyService.findOne({
      _id: handleWarrantyDto.warranty,
      status: 'progress'
    }, {populate: {path: 'fromDistributionAgent'}})
    const distributionAgent = await this.distributionAgentService.findOne({_id: warranty.fromDistributionAgent})
    const warrantyCenter = await this.warrantyCenterService.findOne({_id: account.belongTo})
    const {data, paginationOptions} = await this.productService.findAll({_id: {$in: warranty.products}})

    if (handleWarrantyDto.status === 'success') {
      for (const ele of data) {
        ele.status = 'fixed'
        ele.currentlyBelong = warranty.fromDistributionAgent._id
        ele.currentlyBelongModel = Model.DISTRIBUTION_AGENT
        ele.history = [...ele.history, {
          type: 'warranted',
          from: warrantyCenter.name,
          to: distributionAgent.name,
          createdAt: moment().utcOffset('+0700').format('YYYY-MM-DD HH:mm'),
        }]
        await ele.save()
      }
      warranty.status = 'success'
      await warranty.save()
    } else if (handleWarrantyDto.status === 'failure') {
      for (const ele of data) {
        ele.status = 'failure'
        ele.currentlyBelong = distributionAgent._id;
        ele.currentlyBelongModel = Model.DISTRIBUTION_AGENT
        ele.history = [...ele.history, {
          type: 'failure',
          from: warrantyCenter.name,
          to: distributionAgent.name,
          createdAt: moment().utcOffset('+0700').format('YYYY-MM-DD HH:mm'),
        }]
        await ele.save()
      }
      warranty.status = 'failure'
      await warranty.save()
    }

    return {
      success: true,
      message: "Ok"
    }
  }

  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.WarrantyCenter))
  @Get("warranty-requests")
  async getAllWarranty(@AccountDecorator() account: AccountDocument, @Query() warrantyQuery: WarrantyQueryDto, @Query() options: PaginationParamsDto) {
    const warrantyCenter = await this.warrantyCenterService.findOne({_id: account.belongTo})
    const {data, paginationOptions} = await this.warrantyService.findAll({warrantyCenter, ...warrantyQuery}, {
      populate: [{
        path: 'fromDistributionAgent',
        select: 'name address phoneNumber'
      }, {
        path: 'products',
        populate: [{path: 'productLine'}]
      }, {
        path: 'customer',
        select: 'name address phoneNumber'
      }, {path: 'warrantyCenter', select: 'name address phoneNumber'},]
    })
    return {
      data,
      paginationOptions
    }
  }
}
