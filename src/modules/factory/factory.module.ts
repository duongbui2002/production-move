import {Global, Module} from '@nestjs/common';
import {FactoryService} from './factory.service';
import {FactoryController} from './factory.controller';
import {ProductModule} from "@modules/product/product.module";

@Global()
@Module({
  providers: [FactoryService],
  controllers: [FactoryController],
  exports: [FactoryService],
  imports: [ProductModule]
})
export class FactoryModule {
}
