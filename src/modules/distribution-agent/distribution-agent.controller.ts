import {Body, Controller, HttpCode, HttpException, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {DistributionAgentService} from "@modules/distribution-agent/distribution-agent.service";
import {CreateDistributionAgentDto} from "@modules/distribution-agent/dto/create-distribution-agent.dto";
import {AuthGuard} from "@common/guards/auth.guard";
import RoleGuard from "@common/guards/roles.guard";
import Role from "@common/enums/role.enum";
import {CreateDistributionManagementDto} from "@modules/distribution-management/dto/create-distribution-management.dto";
import {AccountDecorator} from "@common/decorators/account.decorator";
import {AccountDocument} from "@modules/account/schemas/account.schema";
import {FactoryService} from "@modules/factory/factory.service";
import {ImportProductDto} from "@modules/factory/dto/import-product.dto";
import {ProductService} from "@modules/product/product.service";
import {DistributionManagementService} from "@modules/distribution-management/distribution-management.service";
import * as moment from "moment";
import {CreateWarrantyDto} from "@modules/distribution-agent/dto/create-warranty.dto";
import {WarrantyService} from "@modules/warranty/warranty.service";
import {CustomerService} from "@modules/customer/customer.service";
import {WarrantyCenterService} from "@modules/warranty-center/warranty-center.service";
import {Model, ProductStatus} from "@common/enums/common.enum";

@Controller('distribution-agent')
export class DistributionAgentController {
  constructor(private readonly distributionAgentService: DistributionAgentService,
              private readonly factoryService: FactoryService,
              private readonly distributionManagementService: DistributionManagementService,
              private readonly productService: ProductService,
              private readonly warrantyService: WarrantyService,
              private readonly customer: CustomerService,
              private readonly warrantyCenterService: WarrantyCenterService) {
  }

  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.ExecutiveBoard))
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createDistributionAgentDto: CreateDistributionAgentDto) {
    const newData = await this.distributionAgentService.create(createDistributionAgentDto)
    return {
      data: newData,
      success: true
    }
  }


  @Post('request-products')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.DistributionAgent))
  async createRequestProduct(@Body() createDistributionManagementDto: CreateDistributionManagementDto, @AccountDecorator() account: AccountDocument) {
    const factory = await this.factoryService.findOne({_id: createDistributionManagementDto.factory}, {
      populate: {
        path: 'warehouses'
      }
    })
    const distributionAgent = await this.distributionAgentService.findOne({_id: createDistributionManagementDto.distributionAgent})
    console.log(distributionAgent)

    const newRequestExportProduct = await this.distributionManagementService.create({
      factory,
      distributionAgent: distributionAgent._id,
      productRequest: createDistributionManagementDto.productRequest
    })

    return {
      data: newRequestExportProduct,
      success: true
    }
  }

  @Post('imports')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.DistributionAgent))
  async importProducts(@Body() importProductDto: ImportProductDto, @AccountDecorator() account: AccountDocument) {
    const distributionAgent = await this.distributionAgentService.findOne({_id: account.belongTo}, {
      populate: {
        path: 'warehouses'
      }
    })
    let warehouseIndex = distributionAgent.warehouses.findIndex(warehouse => warehouse._id.toString() === importProductDto.warehouse)
    if (warehouseIndex === -1) {
      throw new HttpException('The distribution agent does not own this warehouse', HttpStatus.NOT_FOUND)
    }

    if (!importProductDto.importProducts) {
      const {data, paginationOptions} = await this.productService.findAll({
        distributedBy: distributionAgent._id,
        belongToWarehouse: null,
        status: 'distributed'
      })

      for (const ele of data) {


        ele.history.push({
          createdAt: moment().utcOffset('+0700').format('YYYY-MM-DD HH:mm'),
          type: 'import',
          to: `${distributionAgent.warehouses[warehouseIndex].name}`,
          from: `${distributionAgent.name}`
        })
        ele.belongToWarehouse = distributionAgent.warehouses[warehouseIndex]

        ele.currentlyBelong = distributionAgent._id
        ele.currentlyBelongModel = 'DistributionAgent'
        await ele.save()
      }

      return {
        success: true,
        message: "Imports all product to warehouse successfully"
      }
    }

    const {data, paginationOptions} = await this.productService.findAll({
      distributedBy: distributionAgent._id,
      belongToWarehouse: null,
      status: 'distributed',
      _id: {$in: importProductDto.importProducts}
    })

    for (const ele of data) {
      ele.belongToWarehouse = distributionAgent.warehouses[warehouseIndex]
      ele.history.push({
        createdAt: moment().utcOffset('+0700').format('YYYY-MM-DD HH:mm'),
        type: 'import',
        to: `${distributionAgent.warehouses[warehouseIndex].name}`,
        from: `${distributionAgent.name}`
      })
      ele.currentlyBelong = distributionAgent._id

      await ele.save()
    }

    return {
      success: true,
      message: "Imports all product to warehouse successfully"
    }
  }

  @Post('warranty')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.DistributionAgent))
  async createWarranty(@Body() createWarrantyDto: CreateWarrantyDto, @AccountDecorator() account: AccountDocument) {

    const {data, paginationOptions} = await this.productService.findAll({
      _id: {$in: createWarrantyDto.products},
      status: 'sold',
    })

    if (data.length === 0) {
      throw new HttpException('Products not found', HttpStatus.BAD_REQUEST)
    }

    let errorMessages: string[] = []

    for (const ele of data) {
      if (moment().isAfter(ele.warrantyExpiresAt)) {
        errorMessages.push(`The product with ${ele._id} is out of warranty period.`)
      }
    }
    if (errorMessages.length > 0) {
      throw new HttpException(errorMessages, HttpStatus.BAD_REQUEST)
    }

    const distributionAgent = await this.distributionAgentService.findOne({_id: account.belongTo})
    const customer = await this.customer.findOne({_id: createWarrantyDto.customer})
    const warrantyCenter = await this.warrantyCenterService.findOne({_id: createWarrantyDto.warrantyCenter})


    const newData = await this.warrantyService.create({
      products: createWarrantyDto.products,
      status: 'progress',
      fromDistributionAgent: distributionAgent,
      customer: customer,
      warrantyCenter
    })

    for (const ele of data) {

      ele.status = ProductStatus.WARRANTING
      ele.currentlyBelong = warrantyCenter._id
      ele.currentlyBelongModel = Model.WARRANTY_CENTER
      ele.history = [...ele.history, {
        createdAt: moment().utcOffset('+0700').format('YYYY-MM-DD HH:mm'),
        type: 'warranting',
        to: `${warrantyCenter.name}`,
        from: `${distributionAgent.name}`
      }]
      await ele.save()
    }

    return {
      success: true,
      data: newData
    }
  }

}
