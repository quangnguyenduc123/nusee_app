import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostDto {
    @ApiProperty({ description: 'The HTML content of the post' })
    @IsString()
    @IsNotEmpty()
    readonly data: string;
  }