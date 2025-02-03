import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FindOrdersDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  agent_id?: number;
}
