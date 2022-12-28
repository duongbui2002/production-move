import {IsMongoId, IsNumber, IsOptional, IsString, Max, Min} from "class-validator";
import {Type} from "class-transformer";

export class DefectiveProductStatisticDto {

  @IsOptional()
  @IsString()
  productLine?: string

  @IsOptional()
  @IsString()
  producedBy?: string


  @IsOptional()
  @IsMongoId()
  distributionAgent?: string
}