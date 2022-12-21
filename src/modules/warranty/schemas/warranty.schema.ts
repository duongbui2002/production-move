import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import {Product, ProductDocument} from "@modules/product/schemas/product.schema";
import {Document, PopulateOptions} from "mongoose";
import {autoPopulate} from "@src/utils/populate-query";
import * as paginate from "mongoose-paginate-v2";
import {
  DistributionAgent,
  DistributionAgentDocument
} from "@modules/distribution-agent/schemas/distribution-agent.schema";
import {Customer, CustomerDocument} from "@modules/customer/schemas/customer.schema";
import {WarrantyCenter, WarrantyCenterDocument} from "@modules/warranty-center/schemas/warranty-center.schema";

export type WarrantyDocument = Warranty & Document

@Schema({
  timestamps: true
})
export class Warranty {
  @Prop({
    required: true,
    type: [{type: mongoose.Schema.Types.ObjectId}],
    ref: 'Product'
  })
  products: ProductDocument[]

  @Prop({
    enum: ['progress', 'finish', 'broken'],
    default: 'progress'
  })
  status: string

  @Prop({
    required: true,
    type: [{type: mongoose.Schema.Types.ObjectId}],
    ref: 'DistributionAgent'
  })
  fromDistributionAgent: DistributionAgentDocument

  @Prop({
    required: true,
    type: [{type: mongoose.Schema.Types.ObjectId}],
    ref: 'Customer'
  })
  customer: CustomerDocument

  @Prop({
    required: true,
    type: [{type: mongoose.Schema.Types.ObjectId}],
    ref: 'WarrantyCenter'
  })
  warrantyCenter: WarrantyCenterDocument
}

export const WarrantySchema = SchemaFactory.createForClass(Warranty)

WarrantySchema.plugin(paginate)
