import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { FactoryService } from "@modules/factory/factory.service";
import { CreateFactoryDto } from "@modules/factory/dto/create-factory.dto";
import { PaginationParamsDto } from "@common/dto/pagination-params.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import RoleGuard from "@common/guards/roles.guard";
import Role from "@common/enums/role.enum";
import { ProductService } from "@modules/product/product.service";
import { ImportProductDto } from "@modules/factory/dto/import-product.dto";
import { AccountDecorator } from "@common/decorators/account.decorator";
import { AccountDocument } from "@modules/account/schemas/account.schema";
import { DistributionManagementService } from "@modules/distribution-management/distribution-management.service";
import * as mongoose from "mongoose";
import * as moment from "moment";
import { ProductStatisticDto } from "@common/dto/product-statistic.dto";
import { ProductLineService } from "@modules/product-line/product-line.service";
import { DistributionAgentService } from "@modules/distribution-agent/distribution-agent.service";
import { WarehouseService } from "@modules/warehouse/warehouse.service";
import { DefectiveProductStatisticDto } from "@common/dto/defective-product-statistic.dto";
import { FilterQuery } from "mongoose";
import { Product, ProductDocument } from "@modules/product/schemas/product.schema";
import { ProductRequestsDto } from "@modules/distribution-management/dto/product-request.dto";
import { distributionManagementPopulate } from "@common/const/populate";

@Controller("factory")
export class FactoryController {
  constructor(private readonly factoryService: FactoryService,
              private productService: ProductService,
              private readonly distributionManagementService: DistributionManagementService,
              private readonly productLineService: ProductLineService,
              private readonly distributionAgent: DistributionAgentService,
              private readonly warehouseService: WarehouseService
  ) {
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.ExecutiveBoard))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFactoryDto: CreateFactoryDto) {
    const newFactory = await this.factoryService.create(createFactoryDto);

    return {
      success: true,
      data: newFactory
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Query() options: PaginationParamsDto) {
    Object.assign(options, { lean: true });
    const { data, paginationOptions } = await this.factoryService.findAll({}, options);
    return {
      data,
      paginationOptions
    };
  }


  @Post("imports")
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.Factory))
  async importProducts(@Body() importProductDto: ImportProductDto, @AccountDecorator() account: AccountDocument) {
    const factory = await this.factoryService.findOne({ _id: account.belongTo }, {
      populate: {
        path: "warehouses"
      }
    });
    if (factory.warehouses.findIndex(warehouse => warehouse._id.toString() === importProductDto.warehouse) === -1) {
      throw new HttpException("The factory does not own this warehouse", HttpStatus.NOT_FOUND);
    }

    const warehouse = await this.warehouseService.findOne({ _id: importProductDto.warehouse });

    if (!importProductDto.importProducts) {
      const { data, paginationOptions } = await this.productService.findAll({
        producedBy: factory._id,
        status: "new"
      }, {

        pagination: false
      });

      if (data.length === 0) {
        throw new HttpException("There are no products to add to stock.", HttpStatus.BAD_REQUEST);
      }
      for (const ele of data) {
        await this.productService.update({ _id: ele._id }, {
          belongToWarehouse: importProductDto.warehouse,
          currentlyBelong: factory._id,
          status: "in-stock",
          currentlyBelongModel: "Factory",
          history: [...ele.history, {
            createdAt: moment().utcOffset("+0700").format("YYYY-MM-DD HH:mm"),
            type: "import",
            to: warehouse.name,
            from: factory.name
          }]
        });
      }
      return {
        success: true,
        message: "Imports all product to warehouse successfully"
      };
    }

    const { data, paginationOptions } = await this.productService.findAll({
      _id: { $in: importProductDto.importProducts },
      producedBy: factory._id,
      belongToWarehouse: null,
      status: "new"
    }, {

      pagination: false
    });

    if (data.length === 0) {
      throw new HttpException("There are no products to add to stock.", HttpStatus.BAD_REQUEST);
    }
    for (const ele of data) {
      await this.productService.update({ _id: ele._id }, {
        belongToWarehouse: importProductDto.warehouse,
        currentlyBelong: factory._id,

        currentlyBelongModel: "Factory",
        status: "in-stock",
        history: [...ele.history, {
          createdAt: moment().utcOffset("+0700").format("YYYY-MM-DD HH:mm"),
          type: "import",
          to: warehouse.name,
          from: factory.name
        }]
      });
    }

    return {
      success: true,
      message: "Import product to warehouse successfully"
    };
  }

  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.Factory))
  @Post(":requestId/export")
  async exportProduct(@AccountDecorator() account: AccountDocument, @Param("requestId") requestId: string) {
    const factory = await this.factoryService.findOne({ _id: account.belongTo });

    const requestProducts = await this.distributionManagementService.findOne({
      _id: requestId,
      status: "wait",
      factory
    });
    const distributionAgent = await this.distributionAgent.findOne({ _id: requestProducts.distributionAgent });
    let productLines: mongoose.Types.ObjectId[] = [];
    for (const productRequest of requestProducts.productRequest) {
      const obj = new mongoose.Types.ObjectId(productRequest.productLine);
      productLines.push(obj);
    }


    const quantityEachProductLines = await this.productService.aggregate([{
      $match: { $and: [{ productLine: { $in: productLines } }, { producedBy: requestProducts.factory }, { status: { $in: ["new", "repair", "in-stock"] } }] }
    }, {
      $group: { _id: "$productLine", count: { $sum: 1 } }
    }]);

    if (quantityEachProductLines.length === 0) {
      throw new HttpException("The number of products in stock is not enough to deliver to the distribution agent.", HttpStatus.BAD_REQUEST);
    }

    for (const quantityEachProductLineObject of quantityEachProductLines) {
      const productRequest = requestProducts.productRequest.find(ele => ele.productLine === quantityEachProductLineObject._id.toString());
      if (productRequest.quantity > quantityEachProductLineObject.count) {
        throw new HttpException("The number of products in stock is not enough to deliver to the distribution agent.", HttpStatus.BAD_REQUEST);
      }
    }
    for (const productRequest of requestProducts.productRequest) {
      const { data } = await this.productService.findAll({
        productLine: productRequest.productLine,
        producedBy: requestProducts.factory,
        status: { $in: ["new", "repair", "in-stock"] }
      }, { limit: productRequest.quantity });

      for (const ele of data) {
        ele.belongToWarehouse = null;
        ele.distributedBy = requestProducts.distributionAgent;
        ele.status = "distributed";
        ele.expiredDate = moment().utcOffset("+0700").add(365, "days").toDate();
        ele.history.push({
          createdAt: moment().utcOffset("+0700").format("YYYY-MM-DD HH:mm").toString(),
          type: "exported",
          from: factory.name,
          to: distributionAgent.name
        });
        ele.currentlyBelong = distributionAgent._id;
        ele.currentlyBelongModel = "DistributionAgent";
        await ele.save();
      }
    }
    requestProducts.status = "exported";
    requestProducts.save();
    return {
      message: "The products have been successfully exported",
      success: true
    };
  }


  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.Factory))
  @Get("product/statistic")
  async productStatistic(@AccountDecorator() account: AccountDocument, @Query() productStatisticDto: ProductStatisticDto, @Query() paginationParamsDto: PaginationParamsDto) {
    let aggregate = [];

    let queryFilter: FilterQuery<ProductDocument> = {
      producedBy: account.belongTo
    };

    if (productStatisticDto.month) {
      aggregate.push({ $eq: [{ $month: "$createdAt" }, productStatisticDto.month] });
    }
    if (productStatisticDto.year) {
      aggregate.push({
        $eq: [{ $year: "$createdAt" }, productStatisticDto.year
        ]
      });
    }

    if (productStatisticDto.quarter) {
      let startMonth;
      let endMonth;
      switch (productStatisticDto.quarter) {
        case 1:
          startMonth = 1;
          endMonth = 3;
          break;
        case 2:
          startMonth = 4;
          endMonth = 6;
          break;
        case 3:
          startMonth = 7;
          endMonth = 9;
          break;
        case 4:
          startMonth = 10;
          endMonth = 12;
          break;
      }
      aggregate.push({
        $or: [{ $eq: [{ $month: "$createdAt" }, startMonth] }, {
          $eq: [{ $month: "$createdAt" }, startMonth + 1]
        }, { $eq: [{ $month: "$createdAt" }, endMonth] }
        ]

      });
    }

    if (productStatisticDto.productLineCode) {
      const productLine = await this.productLineService.findOne({ productLineCode: productStatisticDto.productLineCode });
      Object.assign(queryFilter, { productLine: productLine });
    }

    if (productStatisticDto.status) {
      Object.assign(queryFilter, { status: productStatisticDto.status });
    }

    let { data, paginationOptions } = await this.productService.findAll({
      $expr: {
        $and: aggregate
      },
      ...queryFilter
    }, { ...paginationParamsDto });
    const satisfiedProductId: string[] = [];
    for (const ele of data) {
      satisfiedProductId.push(ele._id);
    }

    const results = await this.productService.aggregate([
      { $match: { _id: { $in: satisfiedProductId } } }
      , {
        $group: {
          _id: "$productLine",
          total: { $sum: 1 }
        }
      }]);
    for (const result of results) {
      const productLine = await this.productLineService.findOne({ _id: result._id });
      Object.assign(result, { productLine });
      delete result._id;
    }
    return {
      data,
      totalProductEachProductLine: results,
      paginationOptions

    };
  }


  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.Factory))
  @Get("defective-product/statistic")
  async defectiveProductStatistic(@AccountDecorator() account: AccountDocument,
                                  @Query() defectiveProductStatisticDto: DefectiveProductStatisticDto,
                                  @Query() paginationParamsDto: PaginationParamsDto) {

    let queryArray = [];
    const filterQuery: FilterQuery<Product> = {
      timesOfWarranty: { $gt: 0 }
    };
    if (defectiveProductStatisticDto.productLine) {
      Object.assign(filterQuery, { productLine: defectiveProductStatisticDto.productLine });
    }

    if (defectiveProductStatisticDto.producedBy) {
      Object.assign(filterQuery, { producedBy: defectiveProductStatisticDto.producedBy });
    }

    if (defectiveProductStatisticDto.distributionAgent) {
      Object.assign(filterQuery, { distributionAgent: defectiveProductStatisticDto.distributionAgent });
    }

    let { data, paginationOptions } = await this.productService.findAll(filterQuery, { ...paginationParamsDto });
    delete filterQuery.timesOfWarranty;

    let result = await this.productService.findAll(filterQuery, { ...paginationParamsDto });

    return {
      data,
      totalProductPagination: result.paginationOptions,
      paginationOptions
    };
  }

  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.Factory))
  @Get("product-requests")
  async getAllProductRequest(@AccountDecorator() account: AccountDocument, @Query() options: PaginationParamsDto, @Query() filter: ProductRequestsDto) {
    const factory = await this.factoryService.findOne({ _id: account.belongTo });
    const {
      data,
      paginationOptions
    } = await this.distributionManagementService.findAll({ factory, ...filter }, {
      ...options,
      populate: distributionManagementPopulate
    });

    for (const ele of data) {
      for (const x of ele.productRequest) {
        let productLineDocument = await this.productLineService.findOne({ _id: x.productLine });
        Object.assign(x, { productLine: productLineDocument, quantity: x.quantity });
      }
    }

    return {
      data,
      paginationOptions
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const factory = await this.factoryService.findOne({ _id: id });
    return {
      success: true,
      data: factory
    };
  }
}
