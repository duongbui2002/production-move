import {Prop} from "@nestjs/mongoose";
import mongoose from "mongoose";
import {IsNotEmpty, IsString} from "class-validator";

export class CreateWarehouseDto {

  @IsString()
  @IsNotEmpty()
  belongTo: string


  @IsString()
  @IsNotEmpty()
  belongToModel: string

  @IsString()
  @IsNotEmpty()
  address: string

  @IsString()
  @IsNotEmpty()
  name: string
}

