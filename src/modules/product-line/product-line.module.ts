import {Global, Module} from '@nestjs/common';
import {ProductLineService} from './product-line.service';
import {ProductLineController} from './product-line.controller';

@Global()
@Module({
  providers: [ProductLineService],
  controllers: [ProductLineController],
  exports: [ProductLineService]
})
export class ProductLineModule {
}
