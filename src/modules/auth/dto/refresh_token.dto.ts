// login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDTO {
  @ApiProperty({
    description: 'The refresh token provided for refreshing the access token',
    example: 'your-refresh-token-here',
  })
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
