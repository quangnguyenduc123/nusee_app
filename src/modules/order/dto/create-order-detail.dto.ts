import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDetailDto {
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
