import {IsArray, IsNotEmpty, IsString} from "class-validator";
import {Customer} from "@modules/customer/schemas/customer.schema";

export class CreateWarrantyDto {
    @IsNotEmpty()
    @IsArray()
    products: string[]


    @IsString()
    @IsNotEmpty()
    customerName: string

    @IsString()
    @IsNotEmpty()
    address: string

    @IsString()
    @IsNotEmpty()
    phoneNumber: string

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    warrantyCenter: string
}