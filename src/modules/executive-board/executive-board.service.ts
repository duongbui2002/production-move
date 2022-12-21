import {Injectable} from '@nestjs/common';
import {BaseService} from "@common/service/base.service";
import {ExecutiveBoardDocument} from "@modules/executive-board/schemas/executive-board.schema";
import {InjectModel} from "@nestjs/mongoose";
import {PaginateModel} from "mongoose";

@Injectable()
export class ExecutiveBoardService extends BaseService<ExecutiveBoardDocument> {
  constructor(@InjectModel('ExecutiveBoard') private executiveBoardModel: PaginateModel<ExecutiveBoardDocument>
  ) {
    super(executiveBoardModel);
  }
}
