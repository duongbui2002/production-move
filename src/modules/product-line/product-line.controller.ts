import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import {CreateProductLineDto} from "@modules/product-line/dto/create-product-line.dto";
import {ProductLineService} from "@modules/product-line/product-line.service";
import {PaginationParamsDto} from "@common/dto/pagination-params.dto";
import {UpdateProductLineDto} from "@modules/product-line/dto/update-product-line";
import {FilterProductDto} from "@modules/product/dto/filter-product.dto";
import {AuthGuard} from "@common/guards/auth.guard";
import RoleGuard from "@common/guards/roles.guard";
import Role from "@common/enums/role.enum";

@Controller('product-line')
export class ProductLineController {
  constructor(private readonly productLineService: ProductLineService) {
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.ExecutiveBoard))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductLineDto: CreateProductLineDto) {
    const newProductLine = await this.productLineService.create(createProductLineDto);
    return {
      success: true,
      data: newProductLine
    }
  }

  @Get()
  async findAll(@Query() options: PaginationParamsDto) {
    Object.assign(options, {lean: true})

    const {data, paginationOptions} = await this.productLineService.findAll({}, options)
    return {
      data,
      paginationOptions
    }
  }


  @Get(":productLineCode")
  async findOne(@Param("productLineCode") productLineCode: string) {
    const productLine = await this.productLineService.findOne({productLineCode})

    return {
      success: true,
      data: productLine
    }
  }


  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.ExecutiveBoard))
  @Patch(":productLineCode")
  async update(@Param("productLineCode") productLineCode: string, @Body() updateProductLineDto: UpdateProductLineDto) {
    const updatedProductLine = await this.productLineService.update({productLineCode: productLineCode}, updateProductLineDto, {new: true});
    return {
      success: true,
      data: updatedProductLine
    }
  }


  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.ExecutiveBoard))
  @Delete(":productLineCode")
  async delete(@Param("productLineCode") productLineCode: string, @Body() updateProductLineDto: UpdateProductLineDto) {
    const deletedProductLine = await this.productLineService.remove({productLineCode: productLineCode});
    return {
      success: true,
      data: deletedProductLine
    }
  }
}
