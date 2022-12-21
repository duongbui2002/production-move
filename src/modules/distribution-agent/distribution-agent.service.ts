import {Injectable} from '@nestjs/common';
import {BaseService} from "@common/service/base.service";
import {DistributionAgentDocument} from "@modules/distribution-agent/schemas/distribution-agent.schema";
import {InjectModel} from "@nestjs/mongoose";
import {PaginateModel} from "mongoose";

@Injectable()
export class DistributionAgentService extends BaseService<DistributionAgentDocument> {
  constructor(@InjectModel('DistributionAgent') distributionAgentModel: PaginateModel<DistributionAgentDocument>) {
    super(distributionAgentModel);
  }


}
