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
} from '@nestjs/common';
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
import e from "express";
import {MailService} from "@modules/mail/mail.service";
import {ProductStatisticDto} from "@common/dto/product-statistic.dto";
import {PaginationParamsDto} from "@common/dto/pagination-params.dto";
import {ProductLineService} from "@modules/product-line/product-line.service";
import {FilterQuery} from "mongoose";
import {ProductDocument} from "@modules/product/schemas/product.schema";
import {ReturnProductsToFactoryDto} from "@modules/distribution-agent/dto/return-products-to-factory.dto";
import {productPopulate} from "@common/const/populate";


@Controller('distribution-agent')
export class DistributionAgentController {
    constructor(private readonly distributionAgentService: DistributionAgentService,
                private readonly factoryService: FactoryService,
                private readonly distributionManagementService: DistributionManagementService,
                private readonly productService: ProductService,
                private readonly warrantyService: WarrantyService,
                private readonly customerService: CustomerService,
                private readonly warrantyCenterService: WarrantyCenterService,
                private readonly mailService: MailService,
                private readonly productLineService: ProductLineService) {
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

    @UseGuards(AuthGuard)
    @Get()
    async get(@Query() options: PaginationParamsDto) {
        const {data, paginationOptions} = await this.distributionAgentService.findAll({}, options)
        return {
            data: data,
            paginationOptions,
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
        const distributionAgent = await this.distributionAgentService.findOne({_id: account.belongTo})


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


            if (data.length === 0) {
                throw new HttpException('There are no products to add to stock.', HttpStatus.BAD_REQUEST)
            }
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


        if (data.length === 0) {
            throw new HttpException('There are no products to add to stock.', HttpStatus.BAD_REQUEST)
        }

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

        if (data.length === 0 || paginationOptions.totalDocs < createWarrantyDto.products.length) {
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
        let customer;
        try {
            customer = await this.customerService.findOne({
                phoneNumber: createWarrantyDto.phoneNumber,
                address: createWarrantyDto.address,
                name: createWarrantyDto.customerName,
                email: createWarrantyDto.email
            })

        } catch (e: any) {
            customer = await this.customerService.create({
                phoneNumber: createWarrantyDto.phoneNumber,
                address: createWarrantyDto.address,
                name: createWarrantyDto.customerName,
                email: createWarrantyDto.email
            })
        }
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
            ele.timesOfWarranty += 1
            await ele.save()
        }
        return {
            success: true,
            data: newData
        }
    }

    @Post('warranty-return/:warrantyID')
    @UseGuards(AuthGuard)
    @UseGuards(RoleGuard(Role.DistributionAgent))
    async returnProduct(@AccountDecorator() account: AccountDocument, @Param('warrantyID') warrantyId: string) {
        const warranty = await this.warrantyService.findOne({
            _id: warrantyId,
            status: {$in: ['success', 'failure']}
        }, {})
        const distributionAgent = await this.distributionAgentService.findOne({_id: account.belongTo})
        const {
            data,

        } = await this.productService.findAll({_id: {$in: warranty.products}}, {populate: [{path: 'producedBy'}]})
        const customer = await this.customerService.findOne({_id: warranty.customer._id})

        if (warranty.status === 'success') {
            for (const ele of data) {
                ele.status = 'sold'
                ele.currentlyBelong = customer._id
                ele.currentlyBelongModel = Model.CUSTOMER
                ele.history = [...ele.history, {
                    type: 'warranty return',
                    from: distributionAgent.name,
                    to: customer.name,
                    createdAt: moment().utcOffset('+0700').format('YYYY-MM-DD HH:mm'),
                }]
                await ele.save()
            }
        } else if (warranty.status === 'failure') {

            const results = await this.productService.findAll({
                status: 'distributed',
                distributedBy: account.belongTo,
            })


            if (results.paginationOptions.totalDocs < warranty.products.length) {
                throw new HttpException(`Not enough products to pay customers`, HttpStatus.BAD_REQUEST)
            }
            for (const ele of results.data) {
                ele.status = 'sold'
                ele.currentlyBelong = customer._id
                ele.currentlyBelongModel = Model.CUSTOMER
                ele.history = [...ele.history, {
                    type: 'sold',
                    from: distributionAgent.name,
                    to: customer.name,
                    createdAt: moment().utcOffset('+0700').format('YYYY-MM-DD HH:mm'),
                }]
                await ele.save()
            }

            for (const ele of data) {
                const factory = await this.factoryService.findOne({_id: ele.producedBy})
                console.log(factory)
                ele.status = 'failure'
                ele.currentlyBelong = factory._id
                ele.currentlyBelongModel = Model.FACTORY
                ele.history = [...ele.history, {
                    type: 'return to factory',
                    from: distributionAgent.name,
                    to: factory.name,
                    createdAt: moment().utcOffset('+0700').format('YYYY-MM-DD HH:mm'),
                }]
                await ele.save()
            }
        }
        warranty.status = "finished"
        await warranty.save()
        return {
            success: true,
            message: "Success"
        }
    }

    @UseGuards(AuthGuard)
    @UseGuards(RoleGuard(Role.DistributionAgent))
    @Get('expired-products')
    async expiredProducts(@AccountDecorator() account: AccountDocument, @Query() paginationParamsDto: PaginationParamsDto) {
        const today = moment().utcOffset('+0700').toDate()

        const distributionAgent = await this.distributionAgentService.findOne({_id: account.belongTo})
        const {data, paginationOptions} = await this.productService.findAll({
            expiredDate: {$lte: today},
            status: 'distributed',
            distributedBy: distributionAgent._id
        }, {
            populate: productPopulate
        })

        return {
            data,
            paginationOptions
        }
    }

    @UseGuards(AuthGuard)
    @UseGuards(RoleGuard(Role.DistributionAgent))
    @Post('return-products-to-factory')
    async returnProducts(@AccountDecorator() account: AccountDocument, @Body() returnProductsToFactory: ReturnProductsToFactoryDto, @Query() paginationParamsDto: PaginationParamsDto) {


        const distributionAgent = await this.distributionAgentService.findOne({_id: account.belongTo})
        const {data, paginationOptions} = await this.productService.findAll({
            _id: {$in: returnProductsToFactory.products},
            status: 'distributed',
            distributedBy: distributionAgent._id
        }, {})
        for (const ele of data) {

            let factory = await this.factoryService.findOne({_id: ele.producedBy})
            ele.status = 'old'
            ele.currentlyBelong = factory._id
            ele.currentlyBelongModel = "Factory"
            ele.history = [...ele.history, {
                type: 'return to factory',
                from: distributionAgent.name,
                to: factory.name,
                createdAt: moment().utcOffset('+0700').format('YYYY-MM-DD HH:mm'),
                reason: 'No one has purchased this product'
            }]

            await ele.save()
        }

        return {
            message: "The product has been returned to the factory",
            success: true
        }
    }

    @UseGuards(AuthGuard)
    @UseGuards(RoleGuard(Role.DistributionAgent))
    @Get('product/statistics')
    async productStatistic(@AccountDecorator() account: AccountDocument, @Query() productStatisticDto: ProductStatisticDto, @Query() paginationParamsDto: PaginationParamsDto) {
        let aggregate = []
        let queryFilter: FilterQuery<ProductDocument> = {
            distributedBy: account.belongTo
        }

        if (productStatisticDto.month) {
            aggregate.push({$eq: [{$month: "$createdAt"}, productStatisticDto.month]})
        }
        if (productStatisticDto.year) {
            aggregate.push({
                $eq: [{$year: "$createdAt"}, productStatisticDto.year
                ]
            })
        }

        if (productStatisticDto.quarter) {
            let startMonth;
            let endMonth;
            switch (productStatisticDto.quarter) {
                case 1:
                    startMonth = 1;
                    endMonth = 3
                    break;
                case 2:
                    startMonth = 4;
                    endMonth = 6
                    break;
                case 3:
                    startMonth = 7;
                    endMonth = 9
                    break;
                case 4:
                    startMonth = 10;
                    endMonth = 12
                    break;
            }
            aggregate.push({
                $or: [{$eq: [{$month: "$createdAt"}, startMonth]}, {
                    $eq: [{$month: "$createdAt"}, startMonth + 1]
                }, {$eq: [{$month: "$createdAt"}, endMonth]},
                ]

            })
        }

        if (productStatisticDto.productLineCode) {
            const productLine = await this.productLineService.findOne({productLineCode: productStatisticDto.productLineCode})
            Object.assign(queryFilter, {productLine: productLine})
        }

        if (productStatisticDto.status) {
            if (productStatisticDto.status === 'sold') {
                Object.assign(queryFilter, {status: {$in: [productStatisticDto.status, "warranting", "fixed"]}})
            } else {
                Object.assign(queryFilter, {status: productStatisticDto.status})
            }
        }

        let {data, paginationOptions} = await this.productService.findAll({
            $expr: {
                $and: aggregate
            },
            ...queryFilter
        }, {
            ...paginationParamsDto,
            populate: productPopulate
        })
        return {
            data,
            paginationOptions
        }
    }


    @Get(":id")
    async getById(@Param('id') id: string) {
        const data = await this.distributionAgentService.findOne({_id: id})
        return {
            data: data,
            success: true
        }
    }
}
