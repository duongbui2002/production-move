import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {WarehouseService} from './warehouse.service';
import {CreateWarehouseDto} from './dto/create-warehouse.dto';
import {UpdateWarehouseDto} from './dto/update-warehouse.dto';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {
  }

}
