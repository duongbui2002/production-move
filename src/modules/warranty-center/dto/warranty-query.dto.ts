import {IsOptional, IsString} from "class-validator";

export class WarrantyQueryDto {
  @IsString()
  @IsOptional()
  status?: string



  @IsString()
  @IsOptional()
  customer?: string

}