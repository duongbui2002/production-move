import {Prop} from "@nestjs/mongoose";
import mongoose from "mongoose";
import {ProductLine} from "@modules/product-line/schemas/product-line.schema";
import {IsNotEmpty, IsString} from "class-validator";


export class CreateProductDto {

  @IsString()
  @IsNotEmpty()
  producedBy: string



  @IsString()
  @IsNotEmpty()
  productLine: string

}