import {IsArray, IsNotEmpty, IsString} from "class-validator";
import {ProductRequest} from "@modules/distribution-management/schemas/productRequest";

export class CreateDistributionManagementDto {
  @IsString()
  @IsNotEmpty()
  factory: string

  @IsString()
  @IsNotEmpty()
  distributionAgent: string

  @IsArray()
  @IsNotEmpty()
  productRequest: ProductRequest[]


}