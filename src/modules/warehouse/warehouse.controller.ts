import {Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query} from '@nestjs/common';
import {WarehouseService} from './warehouse.service';
import {CreateWarehouseDto} from './dto/create-warehouse.dto';
import {FactoryService} from "@modules/factory/factory.service";
import {DistributionAgentService} from "@modules/distribution-agent/distribution-agent.service";
import {PaginationParamsDto} from "@common/dto/pagination-params.dto";
import {distributionPopulate, factoryPopulate} from "@modules/warehouse/schemas/warehouse.schema";

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
  async findAll(@Query() options: PaginationParamsDto) {

    const {data, paginationOptions} = await this.warehouseService.findAll({}, options)
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
}
