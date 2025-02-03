import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', isArray: true, description: 'Category images' })
  @IsArray()
  @IsOptional()
  images?: Express.Multer.File[];
}
