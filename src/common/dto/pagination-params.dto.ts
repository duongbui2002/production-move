import {IsNumber, Min, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class PaginationParamsDto {
  @IsOptional()
  @IsString()
  sort?: string = "-_id";

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}
