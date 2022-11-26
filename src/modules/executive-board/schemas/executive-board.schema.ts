import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import {Account} from "@modules/account/schemas/account.schema";

export type ExecutiveBoardDocument = ExecutiveBoard & Document

@Schema({
  timestamps: true
})
export class ExecutiveBoard {
  @Prop({
    required: true,
    trim: true
  })
  name: string

  @Prop({
    required: true,
    trim: true
  })
  address: string

  @Prop({
    required: true,
    trim: true
  })
  phoneNumber: string

  @Prop({
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account'
    }
  )
  account: Account
}

export const ExecutiveBoardSchema = SchemaFactory.createForClass(ExecutiveBoard);
