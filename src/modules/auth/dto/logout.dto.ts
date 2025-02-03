import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutDTO {
    @ApiProperty({
        description: 'The refresh token provided for logging out',
        example: 'your-refresh-token-here',
    })
    @IsNotEmpty()
    @IsString()
    refresh_token: string;
}
