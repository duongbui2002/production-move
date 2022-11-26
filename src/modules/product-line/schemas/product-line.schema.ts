import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

export type ProductLineDocument = ProductLine & Document

@Schema({
  timestamps: true
})
export class ProductLine {
  @Prop({
    required: true,
    trim: true,
    unique: true
  })
  productLine: string

  @Prop({
    required: true,
    trim: true,
  })
  description: string
}

export const ProductLineSchema = SchemaFactory.createForClass(ProductLine)