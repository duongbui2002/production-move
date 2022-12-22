import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";
import {Warehouse} from "@modules/warehouse/schemas/warehouse.schema";
import * as populate from 'mongoose-paginate-v2'

export type DistributionAgentDocument = DistributionAgent & Document & {
  warehouses?: any[]
}

@Schema({
  timestamps: true
})
export class DistributionAgent {
  @Prop({
    required: true,
    trim: true
  })
  name: string;

  @Prop({
    required: true
  })
  address: string;

  @Prop({
    required: true
  })
  phoneNumber: string

  @Prop({
    default: "DistributionAgent"
  })
  model: string
}

export const DistributionAgentSchema = SchemaFactory.createForClass(DistributionAgent)

DistributionAgentSchema.virtual('warehouses', {
  ref: 'Warehouse',
  localField: '_id',
  foreignField: "belongTo"
})

DistributionAgentSchema.plugin(populate)