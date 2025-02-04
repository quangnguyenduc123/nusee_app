import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdatePostDto {
    @ApiProperty({ description: 'The HTML content of the post' })
    @IsString()
    @IsNotEmpty()
    readonly data?: string;
    @ApiProperty({ description: 'The updated number of likes', required: false })
    @IsNumber()
    @IsOptional()
    readonly likes?: number;
  
    @ApiProperty({ description: 'The updated number of views', required: false })
    @IsNumber()
    @IsOptional()
    readonly views?: number;
}