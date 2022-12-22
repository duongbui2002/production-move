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
  Query, UploadedFile, UploadedFiles,
  UseGuards, UseInterceptors
} from '@nestjs/common';
import {CreateProductLineDto} from "@modules/product-line/dto/create-product-line.dto";
import {ProductLineService} from "@modules/product-line/product-line.service";
import {PaginationParamsDto} from "@common/dto/pagination-params.dto";
import {UpdateProductLineDto} from "@modules/product-line/dto/update-product-line";
import {AuthGuard} from "@common/guards/auth.guard";
import RoleGuard from "@common/guards/roles.guard";
import Role from "@common/enums/role.enum";
import {FileFieldsInterceptor, FileInterceptor} from "@nestjs/platform-express";
import {randomString} from "@src/utils/slugify";
import {GoogleStorageService} from "@modules/google-storage/google-storage.service";

@Controller('product-line')
export class ProductLineController {
  constructor(private readonly productLineService: ProductLineService, private readonly googleStorageService: GoogleStorageService) {
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    {name: 'images'}
  ]))
  @UseGuards(RoleGuard(Role.ExecutiveBoard))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductLineDto: CreateProductLineDto, @UploadedFiles() files: { images?: Express.Multer.File[] }) {


    if (files.images) {
      let imageUrl = []
      for (const image of files.images) {
        let media = `${image.fieldname}-${randomString(image.originalname, 10)}-${new Date().getTime()}.png`;
        media = await this.googleStorageService.upload(media, image.buffer);
        imageUrl.push(media)
      }
      Object.assign(createProductLineDto, {images: imageUrl});

    }
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
  @UseInterceptors(FileFieldsInterceptor([
    {name: 'images'}
  ]))
  @Patch(":productLineCode")
  async update(@Param("productLineCode") productLineCode: string, @Body() updateProductLineDto: UpdateProductLineDto, @UploadedFiles() files: { images?: Express.Multer.File[] }) {
    if (files.images) {
      let imageUrl = []
      for (const image of files.images) {
        let media = `${image.fieldname}-${randomString(image.originalname, 10)}-${new Date().getTime()}.png`;
        media = await this.googleStorageService.upload(media, image.buffer);
        imageUrl.push(media)
      }
      Object.assign(updateProductLineDto, {images: imageUrl});
    }
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
