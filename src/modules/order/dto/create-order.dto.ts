import {IsArray, IsNotEmpty, IsString} from "class-validator";

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName: string

  @IsString()
  @IsNotEmpty()
  address: string

  @IsString()
  @IsNotEmpty()
  phoneNumber: string


  @IsArray()
  @IsNotEmpty()
  orderProducts: string[]
  @IsString()
  @IsNotEmpty()
  email: string;

}