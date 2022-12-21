import {Global, Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {AccountSchema} from "@modules/account/schemas/account.schema";
import {WarehouseSchema} from "@modules/warehouse/schemas/warehouse.schema";
import {TokenSchema} from "@modules/tokens/schema/token.schema";
import {ExecutiveBoardSchema} from "@modules/executive-board/schemas/executive-board.schema";
import {ProductLineSchema} from "@modules/product-line/schemas/product-line.schema";
import {ProductSchema} from "@modules/product/schemas/product.schema";
import {DistributionAgentSchema} from "@modules/distribution-agent/schemas/distribution-agent.schema";
import {FactorySchema} from "@modules/factory/schemas/factory.schema";
import {DistributionManagementSchema} from "@modules/distribution-management/schemas/distribution-management.schema";
import {WarrantySchema} from "@modules/warranty/schemas/warranty.schema";
import {WarrantyCenter, WarrantyCenterSchema} from "@modules/warranty-center/schemas/warranty-center.schema";
import {OrderSchema} from "@modules/order/schemas/order.schema";
import {CustomerSchema} from "@modules/customer/schemas/customer.schema";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Account',
        schema: AccountSchema
      },
      {
        name: 'Order',
        schema: OrderSchema
      },
      {
        name: 'Warranty',
        schema: WarrantySchema
      },
      {
        name: 'WarrantyCenter',
        schema: WarrantyCenterSchema
      },
      {
        name: 'Warehouse',
        schema: WarehouseSchema
      },
      {
        name: "Token",
        schema: TokenSchema
      },
      {
        name: 'ExecutiveBoard',
        schema: ExecutiveBoardSchema
      },
      {
        name: "ProductLine",
        schema: ProductLineSchema
      }, {
        name: "Product",
        schema: ProductSchema
      }, {
        name: "DistributionAgent",
        schema: DistributionAgentSchema
      }, {
        name: 'Factory',
        schema: FactorySchema
      }, {
        name: 'DistributionManagement',
        schema: DistributionManagementSchema
      }, {
        name: 'Customer',
        schema: CustomerSchema
      }
    ])
  ],
  exports: [
    MongooseModule.forFeature([
      {
        name: 'Account',
        schema: AccountSchema
      },
      {
        name: 'Warehouse',
        schema: WarehouseSchema
      },
      {
        name: "Token",
        schema: TokenSchema
      },
      {
        name: 'WarrantyCenter',
        schema: WarrantyCenterSchema
      },
      {
        name: 'Warranty',
        schema: WarrantySchema
      },
      {
        name: 'ExecutiveBoard',
        schema: ExecutiveBoardSchema
      },
      {
        name: "ProductLine",
        schema: ProductLineSchema
      },
      {
        name: "Product",
        schema: ProductSchema
      }, {
        name: "DistributionAgent",
        schema: DistributionAgentSchema
      }, {
        name: 'Factory',
        schema: FactorySchema
      }, {
        name: 'Order',
        schema: OrderSchema
      }, {
        name: 'DistributionManagement',
        schema: DistributionManagementSchema
      }, {
        name: 'Customer',
        schema: CustomerSchema
      }
    ])
  ]
})
export class DatabaseModule {
}
