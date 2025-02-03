import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

import { Token } from './token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async create(tokenData: Partial<Token>) {
    const token = this.tokenRepository.create(tokenData);
    return this.tokenRepository.save(token);
  }

  async findByRefreshToken(refreshToken: string): Promise<Token | null> {
    return this.tokenRepository.findOne({ where: { refresh_token: refreshToken, expiredAt: MoreThan(new Date()) } });
  }

  async update(token: Token): Promise<Token> {
    return this.tokenRepository.save(token);
  }

  async delete(refreshToken: string): Promise<void> {
    await this.tokenRepository.delete({ refresh_token: refreshToken });
  }
}
