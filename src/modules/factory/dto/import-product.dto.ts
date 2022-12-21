import {IsArray, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class ImportProductDto {
  @IsString()
  @IsNotEmpty()
  warehouse: string

  @IsArray()
  @IsOptional()
  importProducts: string[]
}