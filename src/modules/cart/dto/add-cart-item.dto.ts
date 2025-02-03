import { IsNumber, IsPositive } from 'class-validator';

export class AddCartItemDto {
  @IsNumber()
  @IsPositive()
  cartId: number;

  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
