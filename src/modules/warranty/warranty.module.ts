import {Global, Module} from '@nestjs/common';
import {WarrantyService} from './warranty.service';
import {WarrantyController} from './warranty.controller';

@Global()
@Module({
  providers: [WarrantyService],
  controllers: [WarrantyController],
  exports: [WarrantyService]
})
export class WarrantyModule {
}
