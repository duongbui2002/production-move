import {IsArray, IsNotEmpty} from "class-validator";

export class SetRolesDto {
  @IsArray()
  @IsNotEmpty()
  roles: string[]
}