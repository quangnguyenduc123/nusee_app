import { IsNumber, IsPositive } from 'class-validator';

export class UpdateCartItemDto {
  @IsNumber()
  @IsPositive()
  cartItemId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
