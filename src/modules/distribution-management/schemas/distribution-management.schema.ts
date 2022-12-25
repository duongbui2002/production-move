import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Factory} from "@modules/factory/schemas/factory.schema";
import * as mongoose from "mongoose";
import {
  DistributionAgent,
  DistributionAgentDocument
} from "@modules/distribution-agent/schemas/distribution-agent.schema";
import {ProductRequest} from "@modules/distribution-management/schemas/productRequest";
import {Document} from "mongoose";
import * as paginate from "mongoose-paginate-v2";

export type DistributionManagementDocument = Document & DistributionManagement

@Schema({
  timestamps: true
})
export class DistributionManagement {
  @Prop({
    required: true,
    ref: 'Factory',
    type: mongoose.Schema.Types.ObjectId
  })
  factory: Factory

  @Prop({
    ref: 'DistributionAgent',
    type: mongoose.Schema.Types.ObjectId
  })
  distributionAgent: DistributionAgentDocument

  @Prop({
    required: true,
  })
  productRequest: ProductRequest[]

  @Prop({
    enum: ['wait', 'exported', 'rejected'],
    default: 'wait'
  })
  status: string

  @Prop({
    default: null
  })
  note: string


}

export const DistributionManagementSchema = SchemaFactory.createForClass(DistributionManagement)

DistributionManagementSchema.plugin(paginate)