import {IsNumber, IsOptional, IsString} from "class-validator";


export class UpdateProductLineDto {
  @IsString()
  @IsOptional()
  name: string

  @IsNumber()
  @IsOptional()
  price: number

  @IsString()
  @IsOptional()
  productLineCode: string

  @IsString()
  @IsOptional()
  cpu: string

  @IsString()
  @IsOptional()
  ram: string

  @IsString()
  @IsOptional()
  hardware: string

  @IsString()
  @IsOptional()
  monitor: string

  @IsString()
  @IsOptional()
  graphicsCard: string


  @IsString()
  @IsOptional()
  weight: string

  @IsString()
  @IsOptional()
  battery: string

}