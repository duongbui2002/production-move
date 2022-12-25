import {Prop} from "@nestjs/mongoose";
import {IsOptional, IsString} from "class-validator";

export class UpdateCustomerDto {

  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  address?: string
  @IsString()
  @IsOptional()
  phoneNumber?: string
  @IsString()
  @IsOptional()
  email?: string
}