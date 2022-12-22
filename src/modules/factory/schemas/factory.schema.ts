import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";
import {WarehouseDocument} from "@modules/warehouse/schemas/warehouse.schema";
import * as populate from 'mongoose-paginate-v2'

export type FactoryDocument = Factory & Document & {
  warehouses?: WarehouseDocument[]
}

@Schema({
  timestamps: true
})
export class Factory {
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
    default: "Factory"
  })
  model: string
}

export const FactorySchema = SchemaFactory.createForClass(Factory)

FactorySchema.plugin(populate)

FactorySchema.virtual('warehouses', {
  ref: 'Warehouse',
  localField: '_id',
  foreignField: 'belongTo'
})