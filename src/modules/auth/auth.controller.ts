import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RefreshTokenDTO } from './dto/refresh_token.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LogoutDTO } from './dto/logout.dto';
import { Roles } from './roles.decorator';
import { Role, USER_TYPE } from 'src/util/constant';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login with username, password, and user type' })
  @ApiBody({
    description: 'Provide username, password, and usertype',
    type: LoginDTO,
    examples: {
      example1: {
        summary: 'Admin user login',
        description: 'Example of login as an admin user',
        value: {
          username: 'admin_user',
          password: 'securePassword123',
          user_type: 'admin',
        },
      },
      example2: {
        summary: 'Agency user login',
        description: 'Example of login as an agency user',
        value: {
          username: 'agency_user',
          password: 'anotherSecurePassword456',
          user_type: 'agency',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: LoginDTO) {
    const { username, password, user_type } = loginDto;
    const user = await this.authService.validateUser(
      username,
      password,
      user_type,
    );
    return this.authService.login(user, user_type);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiBody({
    description: 'Provide refresh token',
    type: RefreshTokenDTO,
    examples: {
      example1: {
        value: {
          refresh_token: 'your-refresh-token-here', // Example value
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Refresh token and new access token',
  })
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDTO) {
    const { refresh_token } = refreshTokenDto;
    return this.authService.refreshToken(refresh_token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Log out' })
  @ApiBody({
    description: 'Provide refresh token',
    type: RefreshTokenDTO,
    examples: {
      example1: {
        value: {
          refresh_token: 'your-refresh-token-here', // Example value
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully logged out',
  })
  async logout(@Body() body: LogoutDTO) {
    await this.authService.deleteToken(body.refresh_token);
    return { message: 'Logged out successfully' };
  }
}
