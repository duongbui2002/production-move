import {Global, Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {AccountSchema} from "@modules/account/schemas/account.schema";
import {WarehouseSchema} from "@modules/warehouse/schemas/warehouse.schema";
import {TokenSchema} from "@modules/tokens/schema/token.schema";
import {ExecutiveBoardSchema} from "@modules/executive-board/schemas/executive-board.schema";
import {ProductLineSchema} from "@modules/product-line/schemas/product-line.schema";

@Global()
@Module({
  imports: [
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
        name: 'ExecutiveBoard',
        schema: ExecutiveBoardSchema
      },
      {
        name: "ProductLine",
        schema: ProductLineSchema
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
        name: 'ExecutiveBoard',
        schema: ExecutiveBoardSchema
      },
      {
        name: "ProductLine",
        schema: ProductLineSchema
      }
    ])
  ]
})
export class DatabaseModule {
}
