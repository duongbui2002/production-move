import {IsNumber, IsOptional, IsString, Min} from "class-validator";
import {Type} from "class-transformer";
import {Prop} from "@nestjs/mongoose";
import mongoose from "mongoose";
import {ProductLine} from "@modules/product-line/schemas/product-line.schema";

export class FilterProductDto {
  @IsOptional()
  @IsString()
  producedBy?: string

  @IsOptional()
  @IsString()
  distributedBy?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  belongToWarehouse?: string
  @IsOptional()
  @IsString()
  productLine?: string

  @IsOptional()
  @IsString()
  currentlyBelong?: string


}