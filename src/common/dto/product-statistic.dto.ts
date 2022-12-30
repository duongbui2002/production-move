import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class ProductStatisticDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(12)
  month?: number;


  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(4)
  quarter?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  year?: number;

  @IsOptional()
  @IsString()
  productLineCode?: string;

  @IsOptional()
  @IsString()
  stakeholder?: string;


  @IsOptional()
  @IsString()
  stakeHolderModel?: string;
}