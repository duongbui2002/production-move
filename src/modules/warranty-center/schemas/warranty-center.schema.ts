import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import * as paginate from "mongoose-paginate-v2";
import {Document} from "mongoose";

export type WarrantyCenterDocument = WarrantyCenter & Document

@Schema({
  timestamps: true
})
export class WarrantyCenter {
  @Prop({
    required: true,
  })
  name: string

  @Prop({
    required: true,
  })
  address: string

  @Prop({
    required: true
  })
  phoneNumber: string
  @Prop({
    default: "WarrantyCenter"
  })
  model: string
}

export const WarrantyCenterSchema = SchemaFactory.createForClass(WarrantyCenter)

WarrantyCenterSchema.plugin(paginate)