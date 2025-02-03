import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { addYears } from 'date-fns';
import { Role, USER_TYPE } from 'src/util/constant';
import { Repository } from 'typeorm';

import { TokenService } from './token.service';
import { Admin } from '../admin/admin.entity';
import { Agency } from '../agency/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
  ) {}

  async validateUser(username: string, password: string, userType: string) {
    if (userType === USER_TYPE.ADMIN) {
      const admin = await this.adminRepository.findOne({ where: { username } });
      if (admin) {
        return admin;
      }
    } else {
      const agency = await this.agencyRepository.findOne({
        where: [{ email: username }, { phone: username }],
      });
      if (agency && (await bcrypt.compare(password, agency.hashPassword))) {
        return agency;
      }
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: Admin | Agency, userType: string) {
    let role: string = Role.Agency;
    if (userType === USER_TYPE.ADMIN) {
      const admin = await this.adminRepository.findOneBy({ id: user.id });
      role = admin.role;
    }
    const payload = { userId: user.id, userType, role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '365d' });

    const nextYearDate = addYears(new Date(), 1);
    await this.tokenService.create({
      userId: user.id,
      userType: userType,
      accessToken,
      refresh_token: refreshToken,
      expiredAt: nextYearDate,
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const existingToken =
      await this.tokenService.findByRefreshToken(refreshToken);

    if (!existingToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { userId, userType, role } = this.jwtService.verify(refreshToken);

    // Generate new tokens
    const newAccessToken = this.jwtService.sign({ userId, userType, role });
    const newRefreshToken = this.jwtService.sign(
      { userId, userType },
      { expiresIn: '365d' },
    );

    // Update the token record
    existingToken.accessToken = newAccessToken;
    existingToken.refresh_token = newRefreshToken;
    const nextYearDate = addYears(new Date(), 1);
    existingToken.expiredAt = nextYearDate;
    await this.tokenService.update(existingToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async deleteToken(refreshToken: string): Promise<void> {
    await this.tokenService.delete(refreshToken);
  }
}
