import {IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";
import {Match} from "@common/decorators/validate.decorator";
import {Prop} from "@nestjs/mongoose";

export class RegisterAccountDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;


  @IsNotEmpty()
  @IsString()
  belongTo: string;


  @IsNotEmpty()
  @IsString()
  belongToModel: string


  @IsString()
  @IsNotEmpty()
  displayName: string;


  @IsNotEmpty()
  @IsString()
  @Match("password", {message: "Password and confirm password does not match"})
  confirmPassword: string;
}
