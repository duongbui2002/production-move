import {Global, Module} from '@nestjs/common';
import {ProductService} from './product.service';
import {ProductController} from './product.controller';

@Global()
@Module({
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService]
})
export class ProductModule {
}
