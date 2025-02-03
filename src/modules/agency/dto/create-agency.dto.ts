import { IsString, IsEmail, IsOptional, IsInt, Length } from 'class-validator';

export class CreateAgencyDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsEmail()
  @Length(1, 255)
  email: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  phone?: string;

  @IsInt()
  level: number;

  @IsOptional()
  @IsInt()
  parent_id?: number;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  street?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  ward?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  district?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  city?: string;

  @IsOptional()
  @IsString()
  hashPassword?: string;
}
