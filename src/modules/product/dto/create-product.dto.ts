import {Prop} from "@nestjs/mongoose";
import mongoose from "mongoose";
import {ProductLine} from "@modules/product-line/schemas/product-line.schema";
import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";


export class CreateProductDto {

  @IsString()
  @IsNotEmpty()
  producedBy: string


  @IsString()
  @IsNotEmpty()
  productLine: string

  @IsNumber()
  @IsOptional()
  numberOfProducts?: number = 1

}