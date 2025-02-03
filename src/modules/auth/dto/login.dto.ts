// login.dto.ts
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['admin', 'agency'])
  user_type: 'admin' | 'agency';
}
