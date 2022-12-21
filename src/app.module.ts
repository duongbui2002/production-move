import {Module, NestModule} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import config from "./common/configs/config";
import {DatabaseModule} from "@common/database/database.module";
import {AccountsModule} from "@modules/account/accounts.module";
import {WarehouseModule} from "@modules/warehouse/warehouse.module";
import {AuthModule} from "@modules/auth/auth.module";
import {MongooseModule} from "@nestjs/mongoose";
import {TokensModule} from "@modules/tokens/tokens.module";
import {ProductLineModule} from "@modules/product-line/product-line.module";
import {WarrantyCenterModule} from "@modules/warranty-center/warranty-center.module";
import {WarrantyModule} from "@modules/warranty/warranty.module";
import {FactoryModule} from "@modules/factory/factory.module";
import {ExecutiveBoardModule} from "@modules/executive-board/executive-board.module";
import {ProductModule} from "@modules/product/product.module";
import {OrderModule} from "@modules/order/order.module";
import {DistributionAgentModule} from "@modules/distribution-agent/distribution-agent.module";
import {CustomerModule} from "@modules/customer/customer.module";
import {DistributionManagementModule} from './modules/distribution-management/distribution-management.module';
import mongoose from "mongoose";
import {GoogleStorageModule} from "@modules/google-storage/google-storage.module";
import googleStorageConfig from "@common/configs/google-storage.config";


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [config,googleStorageConfig]
  }), MongooseModule.forRootAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>("mongodb.uri")
    })
  }), DatabaseModule, GoogleStorageModule, AccountsModule, WarehouseModule, AuthModule, TokensModule, ExecutiveBoardModule, ProductModule, ProductLineModule, WarrantyCenterModule, WarrantyModule, FactoryModule, DistributionAgentModule, OrderModule, CustomerModule, DistributionManagementModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
