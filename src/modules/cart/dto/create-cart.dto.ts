import { IsNumber, IsPositive } from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  @IsPositive()
  agencyId: number;
}
