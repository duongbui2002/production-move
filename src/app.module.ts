import {Module} from '@nestjs/common';
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
import { ExecutiveBoardModule } from './modules/executive-board/executive-board.module';
import { ProductModule } from './modules/product/product.module';
import { ProductLineModule } from './modules/product-line/product-line.module';
import { ProductDetailsModule } from './modules/product-details/product-details.module';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [config]
  }), MongooseModule.forRootAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>("mongodb.uri")
    })
  }), DatabaseModule, AccountsModule, WarehouseModule, AuthModule, TokensModule, ExecutiveBoardModule, ProductModule, ProductLineModule, ProductDetailsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
