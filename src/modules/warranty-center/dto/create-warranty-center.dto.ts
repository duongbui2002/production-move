import {Prop} from "@nestjs/mongoose";
import {IsNotEmpty, IsString} from "class-validator";

export class CreateWarrantyCenterDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;


  @IsString()
  @IsNotEmpty()
  phoneNumber: string
}