import {Injectable} from '@nestjs/common';
import {BaseService} from "@common/service/base.service";
import {DistributionManagementDocument} from "@modules/distribution-management/schemas/distribution-management.schema";
import {InjectModel} from "@nestjs/mongoose";
import {PaginateModel} from "mongoose";

@Injectable()
export class DistributionManagementService extends BaseService<DistributionManagementDocument> {
  constructor(@InjectModel('DistributionManagement') private readonly distributionManagementModel: PaginateModel<DistributionManagementDocument>) {
    super(distributionManagementModel);
  }
}
