import {IsNotEmpty, IsString} from "class-validator";

export class HandleWarrantyDto {
  @IsString()
  @IsNotEmpty()
  warranty: string

  @IsString()
  @IsNotEmpty()
  status
}