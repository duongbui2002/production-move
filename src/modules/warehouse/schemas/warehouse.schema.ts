import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Document, PopulateOptions } from "mongoose";
import * as populate from "mongoose-paginate-v2";
import { autoPopulate } from "@src/utils/populate-query";


export type WarehouseDocument = Warehouse & Document;

@Schema({
  timestamps: true
})
export class Warehouse {
  @Prop({
    required: true
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "belongToModel"
  })
  belongTo: string;

  @Prop({
    required: true,
    enum: ["Factory", "DistributionAgent"],
    default: "Factory"
  })
  belongToModel: string;

  @Prop({
    required: true
  })
  address: string;

  @Prop({
    default: "Warehouse"
  })
  model: string;
}

export const factoryPopulate: PopulateOptions = {
  model: "Factory",
  path: "belongTo",
  select: "name address phoneNumber"
};

export const distributionPopulate: PopulateOptions = {
  model: "DistributionAgent",
  path: "belongTo",
  select: "name address phoneNumber"
};
export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);

WarehouseSchema.plugin(populate);

WarehouseSchema
  .pre("save", autoPopulate([factoryPopulate, distributionPopulate]))
  .pre("find", autoPopulate([factoryPopulate, distributionPopulate]))
  .pre("findOne", autoPopulate([factoryPopulate, distributionPopulate]))
  .pre("findOneAndUpdate", autoPopulate([factoryPopulate, distributionPopulate]));
