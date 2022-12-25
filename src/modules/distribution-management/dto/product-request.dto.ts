import {IsOptional, IsString} from "class-validator";

export class ProductRequestsDto {
  @IsString()
  @IsOptional()
  status?: string

  @IsString()
  @IsOptional()
  distributionAgent?: string

}