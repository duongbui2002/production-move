import {Global, Module} from '@nestjs/common';

import {DistributionManagementService} from './distribution-management.service';

@Global()
@Module({
  providers: [DistributionManagementService],
  exports: [DistributionManagementService]
})
export class DistributionManagementModule {
}
