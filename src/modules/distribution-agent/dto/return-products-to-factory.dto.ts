import {IsArray, IsNotEmpty} from "class-validator";


export class ReturnProductsToFactoryDto {
  @IsArray()
  @IsNotEmpty()
  products: string[]
}