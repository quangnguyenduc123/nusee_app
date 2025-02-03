import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FindAllProductsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;
}
