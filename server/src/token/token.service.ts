/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/token/token.service.ts
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { TokenRepository } from '../common/repositories/token.repository';
import { TokenMapper } from './mappers/token.mapper';
import {
  GenerateTokenDto,
  RefreshTokenDto,
  RevokeTokenDto,
  AuthTokensDto,
  TokenResponseDto,
} from './dto/token.dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenRepo: TokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mapper: TokenMapper,
  ) {}

  async generateAuthTokens(payload: GenerateTokenDto): Promise<AuthTokensDto> {
    const accessToken = this.generateAccessToken({
      sub: payload.userId,
      deviceInfo: payload.deviceInfo,
    });

    const refreshToken = await this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken: refreshToken.token,
      expiresIn: this.configService.get<number>('JWT_ACCESS_EXPIRES_IN', 3600),
      tokenType: 'Bearer',
    };
  }
  async getTokenPayload(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });

      // Check if token is valid in database
      if (payload.tokenId) {
        const isValid = await this.validateToken(payload.tokenId);
        if (!isValid) {
          throw new UnauthorizedException('Token has been revoked');
        }
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
  async refreshTokens(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthTokensDto> {
    const { refreshToken } = refreshTokenDto;

    // Проверяем валидность refresh token
    const isValid = await this.tokenRepo.isTokenValid(refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokenEntity = await this.tokenRepo.findByToken(refreshToken);
    if (!tokenEntity) {
      throw new UnauthorizedException('Refresh token not found');
    }

    if (tokenEntity.revoked) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (tokenEntity.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Revoke old token
    await this.tokenRepo.revokeToken(tokenEntity.id);

    // Generate new tokens
    const newTokens = await this.generateAuthTokens({
      userId: tokenEntity.userId,
      deviceInfo: tokenEntity.deviceInfo ?? undefined,
    });

    return newTokens;
  }

  async revokeToken(
    revokeTokenDto: RevokeTokenDto,
  ): Promise<{ message: string }> {
    const token = await this.tokenRepo.findUnique({
      id: revokeTokenDto.tokenId,
    });

    if (!token) {
      throw new NotFoundException(
        `Token with ID ${revokeTokenDto.tokenId} not found`,
      );
    }

    if (token.userId !== revokeTokenDto.userId) {
      throw new ConflictException('Token does not belong to this user');
    }

    await this.tokenRepo.revokeToken(revokeTokenDto.tokenId);

    return { message: 'Token revoked successfully' };
  }

  async revokeAllUserTokens(
    userId: string,
    currentTokenId?: string,
  ): Promise<{ message: string; count: number }> {
    const count = await this.tokenRepo.revokeAllUserTokens(
      userId,
      currentTokenId,
    );

    return {
      message: `Revoked ${count} tokens successfully`,
      count,
    };
  }

  async getUserTokens(userId: string): Promise<TokenResponseDto[]> {
    const tokens = await this.tokenRepo.findUserTokens(userId);
    return this.mapper.toTokenResponseArray(tokens);
  }

  async validateToken(tokenId: string): Promise<boolean> {
    try {
      const token = await this.tokenRepo.findUnique({ id: tokenId });
      if (!token || token.revoked) {
        return false;
      }

      if (token.expiresAt < new Date()) {
        await this.tokenRepo.revokeToken(tokenId);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }
  async cleanupExpiredTokens(): Promise<{ deleted: number }> {
    const deleted = await this.tokenRepo.deleteExpiredTokens();
    return { deleted };
  }

  private generateAccessToken(payload: {
    sub: string;
    deviceInfo?: string;
  }): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '1h'),
    });
  }

  private async generateRefreshToken(
    payload: GenerateTokenDto,
  ): Promise<{ token: string; id: string }> {
    const refreshToken = randomBytes(40).toString('hex');
    const expiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d');

    // Parse expiresIn to milliseconds
    let expiresAt: Date;
    if (typeof expiresIn === 'string') {
      const value = parseInt(expiresIn);
      if (isNaN(value)) {
        // Handle string like '7d'
        const days = parseInt(expiresIn);
        expiresAt = new Date(
          Date.now() + (isNaN(days) ? 7 : days) * 24 * 60 * 60 * 1000,
        );
      } else {
        expiresAt = new Date(Date.now() + value * 1000);
      }
    } else {
      expiresAt = new Date(Date.now() + expiresIn * 1000);
    }

    const created = await this.tokenRepo.create({
      userId: payload.userId,
      token: refreshToken,
      expiresAt,
      deviceInfo: payload.deviceInfo,
    });

    return {
      token: refreshToken,
      id: created.id,
    };
  }
}
