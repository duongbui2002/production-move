import {Prop, Schema} from "@nestjs/mongoose";
import {IsNotEmpty, IsString} from "class-validator";

export class CreateDistributionAgentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string

}