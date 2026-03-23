// src/token/mappers/token.mapper.ts
import { Injectable } from '@nestjs/common';
import { RefreshToken } from '../../generated/client';
import { TokenResponseDto } from '../dto/token.dto';
import { TokenWithUser } from '../../common/repositories/token.repository';

@Injectable()
export class TokenMapper {
  toTokenResponse(token: RefreshToken): TokenResponseDto {
    return new TokenResponseDto({
      id: token.id,
      userId: token.userId,
      token: token.token,
      expiresAt: token.expiresAt,
      deviceInfo: token.deviceInfo ?? undefined,
      revoked: token.revoked,
      createdAt: token.createdAt,
    });
  }

  toTokenResponseWithUser(token: TokenWithUser): TokenResponseDto {
    return new TokenResponseDto({
      id: token.id,
      userId: token.userId,
      token: token.token,
      expiresAt: token.expiresAt,
      deviceInfo: token.deviceInfo ?? undefined,
      revoked: token.revoked,
      createdAt: token.createdAt,
    });
  }

  toTokenResponseArray(tokens: RefreshToken[]): TokenResponseDto[] {
    return tokens.map((token) => this.toTokenResponse(token));
  }
}
