import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {hashSync} from "bcryptjs";
import * as paginate from "mongoose-paginate-v2";
import * as mongoose from "mongoose";
import {Document} from "mongoose";

export type AccountDocument = Account & Document;


@Schema({
  timestamps: true
})
export class Account {
  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  })
  email: string;

  @Prop({
    enum: ['executive-board', 'distribution-agent', 'factory', 'warranty-center'],
    type: [{type: mongoose.Schema.Types.String}]
  })
  roles: string[]

  @Prop({
    required: true,
    trim: true,
    unique: true
  })
  username: string;

  @Prop({
    trim: true
  })
  displayName: string;

  @Prop({
    trim: true,
    minlength: 8,
    maxlength: 32,
    select: false
  })
  password: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'belongToModel'
  })
  belongTo: string

}

export const AccountSchema = SchemaFactory.createForClass(Account);

AccountSchema.pre("save", async function (next) {
  const doc = this;
  if (doc.isModified("password") && doc.password) doc.password = hashSync(doc.password, 10);
  next();
});

AccountSchema.pre("findOneAndUpdate", async function (next) {
  const doc = this;

  if (doc["_update"] && doc["_update"]["password"]) doc["_update"]["password"] = hashSync(doc["_update"]["password"], 10);
  next();
});


AccountSchema.plugin(paginate);
