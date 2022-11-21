import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import config from "./common/configs/config";
import {DatabaseModule} from "@common/database/database.module";
import {AccountModule} from "@modules/account/account.module";


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [config]
  }), DatabaseModule, AccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
