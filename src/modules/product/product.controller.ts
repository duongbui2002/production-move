import {Body, Controller, Delete, Get, Param, Post, Query, UseGuards} from '@nestjs/common';
import {ProductService} from "@modules/product/product.service";
import {CreateProductDto} from "@modules/product/dto/create-product.dto";
import {ProductLineService} from "@modules/product-line/product-line.service";
import {FactoryService} from "@modules/factory/factory.service";
import {WarehouseService} from "@modules/warehouse/warehouse.service";
import {AuthGuard} from "@common/guards/auth.guard";
import RoleGuard from "@common/guards/roles.guard";
import Role from "@common/enums/role.enum";
import * as moment from "moment";
import {FilterProductDto} from "@modules/product/dto/filter-product.dto";
import {PaginationParamsDto} from "@common/dto/pagination-params.dto";

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService,
              private readonly productLineService: ProductLineService,
              private readonly factoryService: FactoryService,
              private readonly warehouseService: WarehouseService) {
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.Factory))
  async create(@Body() createProductDto: CreateProductDto) {
    const productLine = await this.productLineService.findOne({_id: createProductDto.productLine})
    const factory = await this.factoryService.findOne({_id: createProductDto.producedBy})

    const newProduct = await this.productService.create({
      producedBy: factory,
      productLine,
      history: [{
        type: "produce",
        from: factory.name,
        to: factory.name,
        createdAt: moment().utcOffset('+0700').format('YYYY-MM-DD HH:mm')
      }],
      currentlyBelong: factory,
      currentlyBelongModel: 'Factory'
    })
    return {
      data: newProduct,
      success: true
    }
  }

  @Get()
  //@UseGuards(AuthGuard)
  async GetAll(@Query() filterProduct: FilterProductDto, @Query() options: PaginationParamsDto) {
    const {data, paginationOptions} = await this.productService.findAll(filterProduct, options)
    return {
      data,
      paginationOptions
    }
  }

  @Get(":id")
  //@UseGuards(AuthGuard)
  async getById(@Param("id") id: string) {
    const data = await this.productService.findOne({_id: id})
    return {
      data,
      success: true
    }
  }

  @Delete(":id")
  //@UseGuards(AuthGuard)
  async deleteById(@Param("id") id: string) {
    const data = await this.productService.remove({_id: id})
    return {
      data,
      success: true
    }
  }
}
