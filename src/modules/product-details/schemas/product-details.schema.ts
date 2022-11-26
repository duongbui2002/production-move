import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Audio, CPU, HardDrive, Monitor, Ram, Size} from "@common/types/sub-document.type";

export type ProductDetailsDocument = ProductDetails & Document

@Schema({
  timestamps: true
})
export class ProductDetails {
  @Prop({
    required: true,
    trim: true
  })
  cpu: CPU


  @Prop({
    required: true,
  })
  ram: Ram

  @Prop({
    required: true
  })
  hardDrive: HardDrive

  @Prop({
    required: true
  })
  monitor: Monitor

  @Prop({
    default: 'none',
    trim: true
  })
  graphicsCard: String


  @Prop({
    required: true,

  })
  size: Size

  @Prop({
    required: true
  })
  audio: Audio

  @Prop({
    required: true
  })
  weight: string

  @Prop({
    required: true
  })
  battery: string
}

export const ProductDetailsSchema = SchemaFactory.createForClass(ProductDetails)