import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";
import * as paginate from "mongoose-paginate-v2";
import * as mongoose from "mongoose";
import {Account} from "@modules/account/schemas/account.schema";


export type TokenDocument = Token & Document;

@Schema({
  timestamps: true
})
export class Token {
  @Prop({
    required: true,
    trim: true
  })
  token: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId, ref: "Account"
  })
  account: Account;

  @Prop({
    enum: ["access", "refresh", "emailVerify", "changePassword"]
  })
  type: string;

  @Prop({
    required: true
  })
  expiresAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});

TokenSchema.plugin(paginate);
