import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import {ProductLine} from "@modules/product-line/schemas/product-line.schema";
import * as paginate from 'mongoose-paginate-v2'
import {Document} from "mongoose";
import {autoPopulate} from "@src/utils/populate-query";
import {Factory, FactoryDocument} from "@modules/factory/schemas/factory.schema";
import {
  DistributionAgent,
  DistributionAgentDocument
} from "@modules/distribution-agent/schemas/distribution-agent.schema";
import {Warehouse} from "@modules/warehouse/schemas/warehouse.schema";
import {ProductHistorySchema} from "@modules/product/schemas/productHistory.schema";
import {Order} from "@modules/order/schemas/order.schema";
import {WarrantyCenter, WarrantyCenterDocument} from "@modules/warranty-center/schemas/warranty-center.schema";

export type ProductDocument = Product & Document

@Schema({timestamps: true})
export class Product {

  @Prop({
    default: "new",
    enum: ['new', 'in-stock', 'sold', 'distributed', 'fixed', 'failure', 'warranting']
  })
  status: string


  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Factory'
  })
  producedBy: FactoryDocument


  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "DistributionAgent"
  })
  distributedBy: DistributionAgentDocument

  @Prop({
    type: mongoose.Schema.Types.ObjectId,

    default: null,
    ref: "Warehouse"
  })
  belongToWarehouse: Warehouse


  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "ProductLine"
  })
  productLine: ProductLine


  @Prop({
    required: true
  })
  history: ProductHistorySchema[]

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  })
  order: Order

  @Prop({
    default: null
  })
  warrantyExpiresAt: Date


  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    refPath: 'currentlyBelongModel'
  })
  currentlyBelong: string


  @Prop({
    enum: ['Factory', 'Warehouse', 'DistributionAgent', 'Customer', 'WarrantyCenter'],
    default: null,
  })
  currentlyBelongModel: string

}

export const ProductSchema = SchemaFactory.createForClass(Product)

const productPopulate: any[] = [{
  model: 'Factory',
  path: 'producedBy',
  select: 'name address phoneNumber'
}, {
  model: 'DistributionAgent',
  path: 'distributedBy',
  select: 'name address phoneNumber'
}, {
  model: 'Warehouse',
  path: 'belongToWarehouse',
  select: 'address name'
}, {
  model: 'ProductLine',
  path: 'productLine',
}]


ProductSchema
  .pre("save", autoPopulate(productPopulate))
  .pre("find", autoPopulate(productPopulate))
  .pre("findOne", autoPopulate(productPopulate))
  .pre("findOneAndUpdate", autoPopulate(productPopulate));
ProductSchema.plugin(paginate)