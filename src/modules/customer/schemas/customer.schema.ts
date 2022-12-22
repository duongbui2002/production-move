import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import * as populate from 'mongoose-paginate-v2'
import {Document} from "mongoose";

export type  CustomerDocument = Customer & Document

@Schema({
  timestamps: true
})
export class Customer {
  @Prop({
    required: true
  })
  name: string

  @Prop({
    required: true
  })
  address: string

  @Prop({
    required: true,
    unique: true
  })
  phoneNumber: string

  @Prop({
    required: true,
    unique: true
  })
  email: string

}

export const CustomerSchema = SchemaFactory.createForClass(Customer)

CustomerSchema.plugin(populate)