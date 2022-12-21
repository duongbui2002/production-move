import {IsArray, IsNotEmpty, IsString} from "class-validator";
import {Customer} from "@modules/customer/schemas/customer.schema";

export class CreateWarrantyDto {
  @IsNotEmpty()
  @IsArray()
  products: string[]


  @IsNotEmpty()
  @IsString()
  customer: string

  @IsNotEmpty()
  @IsString()
  warrantyCenter: string
}