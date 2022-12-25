import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards
} from '@nestjs/common';
import {WarehouseService} from './warehouse.service';
import {CreateWarehouseDto} from './dto/create-warehouse.dto';
import {FactoryService} from "@modules/factory/factory.service";
import {DistributionAgentService} from "@modules/distribution-agent/distribution-agent.service";
import {PaginationParamsDto} from "@common/dto/pagination-params.dto";
import {distributionPopulate, factoryPopulate, WarehouseDocument} from "@modules/warehouse/schemas/warehouse.schema";
import {AuthGuard} from "@common/guards/auth.guard";
import {AccountDecorator} from "@common/decorators/account.decorator";
import {AccountDocument} from "@modules/account/schemas/account.schema";
import {FilterQuery} from "mongoose";
import Role from "@common/enums/role.enum";

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService,
              private readonly factoryService: FactoryService,
              private readonly distributionAgentService: DistributionAgentService) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createWarehouseDto: CreateWarehouseDto) {

    if (createWarehouseDto.belongToModel == 'Factory') {
      await this.factoryService.findOne({_id: createWarehouseDto.belongTo})

    } else if (createWarehouseDto.belongToModel == 'DistributionAgent') {
      await this.distributionAgentService.findOne({_id: createWarehouseDto.belongTo})
    }
    const newWarehouse = await this.warehouseService.create(createWarehouseDto);

    return {
      success: true,
      data: newWarehouse
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Query() options: PaginationParamsDto, @AccountDecorator() account: AccountDocument) {
    const filter: FilterQuery<WarehouseDocument> = {}
    if (!account.roles.includes(Role.ExecutiveBoard)) {
      Object.assign(filter, {belongTo: account.belongTo})
    }

    const {data, paginationOptions} = await this.warehouseService.findAll(filter, options)
    for (const ele of data) {
      await ele.populate({
        model: ele.modelName,
        path: 'belongTo',
        select: 'name address phoneNumber'
      })
    }
    return {
      data,
      paginationOptions
    }
  }

  @Get(":id")
  async findById(@Param("id") id: string) {

    const warehouse = await this.warehouseService.findOne({_id: id})

    await warehouse.populate({
      model: warehouse.modelName,
      path: 'belongTo',
      select: 'name address phoneNumber'
    })

    return {
      data: warehouse,
      success: true
    }
  }
}
