import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import {Document} from "mongoose";
import {Account} from "@modules/account/schemas/account.schema";


export type WarehouseDocument = Warehouse & Document;

@Schema({
  timestamps: true
})
export class Warehouse {


  @Prop({
    required: true,
    default: 0,
    min: 0
  })
  quantity: number

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Stakeholder'
  })
  belongTo: string
}


export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);