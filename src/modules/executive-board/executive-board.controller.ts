import { Body, Controller, Get, HttpStatus, Post, Query, Res, UseGuards } from "@nestjs/common";
import { ExecutiveBoardService } from "@modules/executive-board/executive-board.service";
import { CreateExecutiveBoardDto } from "@modules/executive-board/dto/create-executive-board.dto";
import { AccountsService } from "@modules/account/accounts.service";
import { FactoryService } from "@modules/factory/factory.service";
import { DistributionAgentService } from "@modules/distribution-agent/distribution-agent.service";
import { WarrantyCenterService } from "@modules/warranty-center/warranty-center.service";
import { AuthGuard } from "@common/guards/auth.guard";
import RoleGuard from "@common/guards/roles.guard";
import Role from "@common/enums/role.enum";
import { ProductService } from "@modules/product/product.service";
import { RecallProductDto } from "@modules/executive-board/dto/recall-product.dto";
import { AccountDecorator } from "@common/decorators/account.decorator";
import { AccountDocument } from "@modules/account/schemas/account.schema";
import { CustomerService } from "@modules/customer/customer.service";
import { MailService } from "@modules/mail/mail.service";
import { ProductLineService } from "@modules/product-line/product-line.service";
import { ProductStatisticDto } from "@common/dto/product-statistic.dto";
import { PaginationParamsDto } from "@common/dto/pagination-params.dto";
import { FilterQuery } from "mongoose";
import { ProductDocument } from "@modules/product/schemas/product.schema";

@Controller("executive-board")
export class ExecutiveBoardController {
  constructor(private readonly executiveBoardService: ExecutiveBoardService,
              private readonly accountService: AccountsService,
              private readonly factoryService: FactoryService,
              private readonly distributionAgentService: DistributionAgentService,
              private readonly warrantyCenterService: WarrantyCenterService,
              private readonly productService: ProductService,
              private readonly customerService: CustomerService,
              private readonly mailService: MailService,
              private readonly productLineService: ProductLineService) {
  }

  @Post()
  async create(@Body() createExecutiveBoardDto: CreateExecutiveBoardDto) {
    const newExecutive = await this.executiveBoardService.create(createExecutiveBoardDto);
    return {
      data: newExecutive,
      success: true
    };
  }

  @Get("stakeholders")
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.ExecutiveBoard))
  async getAllStakeHolders() {
    const executiveBoards = await this.executiveBoardService.findAll({}, { pagination: false });
    const factories = await this.factoryService.findAll({}, { pagination: false });
    const distributionAgents = await this.distributionAgentService.findAll({}, { pagination: false });
    const warrantyCenters = await this.warrantyCenterService.findAll({}, { pagination: false });
    const data: any = [...executiveBoards.data, ...factories.data, ...distributionAgents.data, ...warrantyCenters.data];
    return {
      data: data,
      success: true
    };
  }

  @Post("product-recall")
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.ExecutiveBoard))
  async recallProduct(@Body() recallProductDto: RecallProductDto, @AccountDecorator() account: AccountDocument, @Res() res) {
    const productLine = await this.productLineService.findOne({ _id: recallProductDto.productLine });
    const { data } = await this.productService.findAll({
      status: "sold",
      productLine: recallProductDto.productLine
    }, { pagination: false });


    let emails: string[] = [];
    for (const ele of data) {
      const customer = await this.customerService.findOne({ _id: ele.currentlyBelong }, { lean: true });
      if (!emails.includes(customer.email)) {
        emails.push(customer.email);
      }

    }
    res.status(HttpStatus.OK).json({
      message: "Send mail to all customer",
      success: true
    });
    for (const email of emails) {
      this.mailService.sendRecallNotification(productLine.productLineCode, email);
    }
  }

  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.ExecutiveBoard))
  @Get("product/statistics")
  async productStatistic(@AccountDecorator() account: AccountDocument, @Query() productStatisticDto: ProductStatisticDto, @Query() paginationParamsDto: PaginationParamsDto) {
    let aggregate = [];

    let queryFilter: FilterQuery<ProductDocument> = {};


    if (productStatisticDto.stakeholder) {
      Object.assign(queryFilter, { currentlyBelong: productStatisticDto.stakeholder });
    }

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
    return {
      data,
      paginationOptions
    };
  }

  @UseGuards(AuthGuard)
  @Get("product-line/statistics")
  async productLineStatistic(@AccountDecorator() account: AccountDocument, @Query() paginationParamsDto: PaginationParamsDto) {
    const defectiveProductEachProductLine = await this.productService.aggregate([{
      $match: {
        status: {
          $in: ["failure", "warranting", "fixed"]
        }
      }
    }, {
      $group: {
        _id: "$productLine",
        total: { $sum: 1 }
      }
    }]);
    const defectiveProductLineIDs = [];
    for (const ele of defectiveProductEachProductLine) {
      defectiveProductLineIDs.push(ele._id);
    }
    const productEachProductLine = await this.productService.aggregate([{
      $match: {
        productLine: { $in: defectiveProductLineIDs }
      }
    }, {
      $group: {
        _id: "$productLine",
        total: { $sum: 1 }
      }
    }]);

    const responses: any[] = [];

    for (let i = 0; i < defectiveProductLineIDs.length; i++) {
      const productLine = await this.productLineService.findOne({ _id: defectiveProductEachProductLine[i] }, { lean: true });
      const defectiveProductEachProductLineEle = defectiveProductEachProductLine.find(ele => ele._id.toString() === productLine._id.toString());
      const productEachProductLineEle = productEachProductLine.find(ele => ele._id.toString() === productLine._id.toString());
      responses.push({
        productLine,
        defectiveProductNumbers: defectiveProductEachProductLineEle.total,
        productOfProductLine: productEachProductLineEle.total
      });
    }

    return {
      data: responses,
      success: true
    };
  }

}
