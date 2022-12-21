import {IsNotEmpty, IsString} from "class-validator";


export class CreateExecutiveBoardDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  address: string

  @IsString()
  @IsNotEmpty()
  phoneNumber: string

}