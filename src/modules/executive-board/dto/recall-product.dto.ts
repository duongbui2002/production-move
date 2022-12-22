import {IsNotEmpty, IsString} from "class-validator";

export class RecallProductDto {
  @IsString()
  @IsNotEmpty()
  productLine: string
}
