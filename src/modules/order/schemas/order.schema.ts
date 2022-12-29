import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Product } from "@modules/product/schemas/product.schema";
import * as mongoose from "mongoose";
import { Customer } from "@modules/customer/schemas/customer.schema";
import { WarrantyCenter } from "@modules/warranty-center/schemas/warranty-center.schema";
import * as paginate from "mongoose-paginate-v2";
import { DistributionAgentDocument } from "@modules/distribution-agent/schemas/distribution-agent.schema";

export type OrderDocument = Order & Document & {
  products?: Product[]
}

@Schema({
  timestamps: true
})
export class Order {

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer"
  })
  customer: Customer;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    ref: "Product"
  })
  orderItems: Product[];

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "DistributionAgent"
  })
  distributionAgent: DistributionAgentDocument;
}


export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.virtual("products", {
  localField: "_id",
  foreignField: "order",
  ref: "Product"
});


OrderSchema.plugin(paginate);