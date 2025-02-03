import {
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderDetailDto } from './create-order-detail.dto';

export class UpdateOrderProductsDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  orderDetails: CreateOrderDetailDto[];
}
