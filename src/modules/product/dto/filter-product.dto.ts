import {IsNumber, IsOptional, IsString, Min} from "class-validator";
import {Type} from "class-transformer";

export class FilterProductDto {
  @IsOptional()
  @IsString()
  producedBy?: string

  @IsOptional()
  @IsString()
  distributedBy?: string;

  @IsOptional()
  @IsString()
  status?: string;
}