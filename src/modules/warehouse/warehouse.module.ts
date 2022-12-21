import {Global, Module} from '@nestjs/common';
import {WarehouseService} from './warehouse.service';
import {WarehouseController} from './warehouse.controller';
import {FactoryModule} from "@modules/factory/factory.module";
import {DistributionAgentModule} from "@modules/distribution-agent/distribution-agent.module";

@Global()
@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService],
  exports: [WarehouseService],
  imports: [FactoryModule, DistributionAgentModule]
})
export class WarehouseModule {
}
