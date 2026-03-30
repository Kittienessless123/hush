/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { TokenRepository } from '../common/repositories/token.repository';
import { CurrentUserPayload } from '../common/decorators/current-user/current-user.decorator';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface GenerateTokensOptions {
  userId: string;
  deviceInfo?: string;
  ipAddress?: string;
}

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private readonly accessTokenExpiresIn: number;
  private readonly refreshTokenExpiresIn: number;

  constructor(
    private readonly tokenRepo: TokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Получаем значения из .env
    this.accessTokenExpiresIn = this.parseExpiresIn(
      this.configService.get('JWT_ACCESS_EXPIRES_IN', '3600'),
    );
    this.refreshTokenExpiresIn = this.parseExpiresIn(
      this.configService.get('JWT_REFRESH_EXPIRES_IN', '604800'),
    );

    this.logger.log(
      `Access token expires in: ${this.accessTokenExpiresIn} seconds`,
    );
    this.logger.log(
      `Refresh token expires in: ${this.refreshTokenExpiresIn} seconds`,
    );
  }

  async generateTokens(options: GenerateTokensOptions): Promise<TokenPair> {
    const accessToken = this.generateAccessToken({
      sub: options.userId,
      deviceInfo: options.deviceInfo,
    });

    const refreshToken = await this.generateRefreshToken({
      userId: options.userId,
      deviceInfo: options.deviceInfo,
      ipAddress: options.ipAddress,
    });

    return {
      accessToken,
      refreshToken: refreshToken.token,
      expiresIn: this.accessTokenExpiresIn,
    };
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
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
      await this.tokenRepo.revokeToken(tokenEntity.id);
      throw new UnauthorizedException('Refresh token has expired');
    }

    await this.tokenRepo.revokeToken(tokenEntity.id);

    return this.generateTokens({
      userId: tokenEntity.userId,
      deviceInfo: tokenEntity.deviceInfo ?? undefined,
    });
  }

  async validateAccessToken(token: string): Promise<CurrentUserPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<CurrentUserPayload>(
        token,
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
        },
      );

      if (payload.tokenId) {
        const isValid = await this.tokenRepo.isTokenValid(payload.tokenId);
        if (!isValid) {
          throw new UnauthorizedException('Token has been revoked');
        }
      }

      return payload;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }

  async revokeToken(tokenId: string): Promise<void> {
    await this.tokenRepo.revokeToken(tokenId);
  }

  async revokeAllUserTokens(
    userId: string,
    excludeTokenId?: string,
  ): Promise<number> {
    return this.tokenRepo.revokeAllUserTokens(userId, excludeTokenId);
  }

  private generateAccessToken(payload: Partial<CurrentUserPayload>): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.accessTokenExpiresIn, // Используем число секунд
    });
  }

  private async generateRefreshToken(
    options: GenerateTokensOptions,
  ): Promise<{ token: string; id: string }> {
    const refreshToken = randomBytes(40).toString('hex');
    const expiresAt = this.calculateExpiryDateFromSeconds(
      this.refreshTokenExpiresIn,
    );

    const created = await this.tokenRepo.create({
      userId: options.userId,
      token: refreshToken,
      expiresAt,
      deviceInfo: options.deviceInfo,
    });

    return {
      token: refreshToken,
      id: created.id,
    };
  }

  /**
   * Преобразует строку вида "1h", "30m", "7d" или число в секунды
   */
  private parseExpiresIn(expiresIn: string | number): number {
    if (typeof expiresIn === 'number') {
      return expiresIn;
    }

    // Если строка, пытаемся распарсить
    const match = expiresIn.match(/^(\d+)([dhms])?$/);
    if (!match) {
      // Если не удалось распарсить, возвращаем значение по умолчанию
      this.logger.warn(
        `Invalid expiresIn format: ${expiresIn}, using default 3600 seconds`,
      );
      return 3600;
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    if (!unit) {
      // Если нет единицы измерения, считаем что это секунды
      return value;
    }

    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    return value * (multipliers[unit] || 1);
  }

  /**
   * Создает дату истечения на основе количества секунд
   */
  private calculateExpiryDateFromSeconds(seconds: number): Date {
    return new Date(Date.now() + seconds * 1000);
  }

  /**
   * Оставлен для обратной совместимости, но не используется
   * @deprecated Используйте calculateExpiryDateFromSeconds
   */
  private calculateExpiryDate(expiresIn: string | number): Date {
    if (typeof expiresIn === 'number') {
      return new Date(Date.now() + expiresIn * 1000);
    }

    const match = expiresIn.match(/^(\d+)([dhms])$/);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2];

      const multipliers: Record<string, number> = {
        d: 24 * 60 * 60 * 1000,
        h: 60 * 60 * 1000,
        m: 60 * 1000,
        s: 1000,
      };

      return new Date(Date.now() + value * (multipliers[unit] || 1000));
    }

    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
}
