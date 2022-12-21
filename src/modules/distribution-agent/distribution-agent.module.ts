import {Global, Module} from '@nestjs/common';
import {DistributionAgentService} from './distribution-agent.service';
import {DistributionAgentController} from './distribution-agent.controller';

@Global()
@Module({
  providers: [DistributionAgentService],
  controllers: [DistributionAgentController],
  exports: [DistributionAgentService]
})
export class DistributionAgentModule {
}
