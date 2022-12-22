import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {ExecutiveBoardService} from "@modules/executive-board/executive-board.service";
import {CreateExecutiveBoardDto} from "@modules/executive-board/dto/create-executive-board.dto";
import {AccountsService} from "@modules/account/accounts.service";
import {FactoryService} from "@modules/factory/factory.service";
import {DistributionAgentService} from "@modules/distribution-agent/distribution-agent.service";
import {WarrantyCenterService} from "@modules/warranty-center/warranty-center.service";
import {AuthGuard} from "@common/guards/auth.guard";
import RoleGuard from "@common/guards/roles.guard";
import Role from "@common/enums/role.enum";
import {ProductService} from "@modules/product/product.service";
import {RecallProductDto} from "@modules/executive-board/dto/recall-product.dto";
import {AccountDecorator} from "@common/decorators/account.decorator";
import {AccountDocument} from "@modules/account/schemas/account.schema";
import {CustomerService} from "@modules/customer/customer.service";

@Controller('executive-board')
export class ExecutiveBoardController {
  constructor(private readonly executiveBoardService: ExecutiveBoardService,
              private readonly accountService: AccountsService,
              private readonly factoryService: FactoryService,
              private readonly distributionAgentService: DistributionAgentService,
              private readonly warrantyCenterService: WarrantyCenterService,
              private readonly productService: ProductService,
              private readonly customerService: CustomerService) {
  }

  @Post()
  async create(@Body() createExecutiveBoardDto: CreateExecutiveBoardDto) {
    const newExecutive = await this.executiveBoardService.create(createExecutiveBoardDto);
    return {
      data: newExecutive,
      success: true
    }
  }

  @Get("stakeholders")
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.ExecutiveBoard))
  async getAllStakeHolders() {
    const executiveBoards = await this.executiveBoardService.findAll({}, {pagination: false})
    const factories = await this.factoryService.findAll({}, {pagination: false})
    const distributionAgents = await this.distributionAgentService.findAll({}, {pagination: false})
    const warrantyCenters = await this.warrantyCenterService.findAll({}, {pagination: false})
    const data: any = [...executiveBoards.data, ...factories.data, ...distributionAgents.data, ...warrantyCenters.data]
    return {
      data: data,
      success: true
    }
  }

  @Post("product-recall")
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.ExecutiveBoard))
  async recallProduct(@Body() recallProductDto: RecallProductDto, @AccountDecorator() account: AccountDocument) {
    const {data} = await this.productService.findAll({
      status: "sold",
      productLine: recallProductDto.productLine
    }, {pagination: false})

    let emails: string[] = []
    for (const ele of data) {
      const customer = await this.customerService.findOne({_id: ele.currentlyBelong}, {lean: true})
      if (!emails.includes(customer.email)) {
        emails.push(customer.email)
      }

    }
    console.log(emails)

    return {
      data: "data",
      success: true
    }
  }
}
