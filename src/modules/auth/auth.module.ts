import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { Token } from './token.entity';
import { TokenService } from './token.service';
import { Admin } from '../admin/admin.entity';
import { Agency } from '../agency/entities';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key', // Replace with env
      signOptions: { expiresIn: '24h' },
    }),
    TypeOrmModule.forFeature([Agency]),
    TypeOrmModule.forFeature([Admin]),
    TypeOrmModule.forFeature([Token]),
  ],
  providers: [AuthService, JwtStrategy, TokenService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
