import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Prop} from "@nestjs/mongoose";

export class CreateProductLineDto {
  @IsNumber()
  @IsNotEmpty()
  price: number

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  productLineCode: string

  @IsString()
  @IsNotEmpty()
  cpu: string

  @IsString()
  @IsNotEmpty()
  ram: string

  @IsString()
  @IsNotEmpty()
  hardware: string

  @IsString()
  @IsNotEmpty()
  monitor: string

  @IsString()
  @IsOptional()
  graphicsCard: string


  @IsString()
  @IsNotEmpty()
  weight: string

  @IsString()
  @IsNotEmpty()
  battery: string


}