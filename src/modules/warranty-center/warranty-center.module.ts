import {Global, Module} from '@nestjs/common';
import {WarrantyCenterService} from './warranty-center.service';
import {WarrantyCenterController} from './warranty-center.controller';

@Global()
@Module({
  providers: [WarrantyCenterService],
  controllers: [WarrantyCenterController],
  exports: [WarrantyCenterService]
})
export class WarrantyCenterModule {
}
