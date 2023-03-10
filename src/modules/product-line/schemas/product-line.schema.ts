import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";
import * as populate from 'mongoose-paginate-v2'

export type ProductLineDocument = ProductLine & Document

@Schema({
  timestamps: true
})
export class ProductLine {
  @Prop({
    required: true,
    unique: true
  })
  productLineCode: string

  @Prop({
    required: true,
    trim: true,
    unique: true
  })
  name: string

  @Prop({
    required: true,
    trim: true,

  })
  cpu: string

  @Prop({
    required: true,
  })
  ram: string

  @Prop({
    required: true
  })
  hardware: string

  @Prop({
    required: true
  })
  monitor: string

  @Prop({
    default: 'none',
    trim: true
  })
  graphicsCard: string


  @Prop({
    required: true
  })
  weight: string

  @Prop({
    required: true
  })
  battery: string

  @Prop({
    required: true,
    min: 0
  })
  price: number

  @Prop({
    default: ['https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_75,s_300x300/https://cdn.tgdd.vn/Products/Images/44/282885/s16/apple-pro-m2-2022-10-core-gpu-xam-650x650.png']
  })
  images: string[]
}

export const ProductLineSchema = SchemaFactory.createForClass(ProductLine)

ProductLineSchema.plugin(populate)