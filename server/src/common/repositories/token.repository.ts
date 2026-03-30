/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/token/repositories/token.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RefreshToken, Prisma } from '@prisma/client';

export interface CreateTokenData {
  userId: string;
  token: string;
  expiresAt: Date;
  deviceInfo?: string | null;
  ipAddress?: string | null;
}

@Injectable()
export class TokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTokenData): Promise<RefreshToken> {
    return await this.prisma.refreshToken.create({
      data: {
        userId: data.userId,
        token: data.token,
        expiresAt: data.expiresAt,
        deviceInfo: data.deviceInfo,
      },
    });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return await this.prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  async findUnique(
    where: Prisma.RefreshTokenWhereUniqueInput,
  ): Promise<RefreshToken | null> {
    return await this.prisma.refreshToken.findUnique({ where });
  }

  async revokeToken(tokenId: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id: tokenId },
      data: { revoked: true },
    });
  }

  async revokeAllUserTokens(
    userId: string,
    excludeTokenId?: string,
  ): Promise<number> {
    const result = await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revoked: false,
        ...(excludeTokenId && { NOT: { id: excludeTokenId } }),
      },
      data: { revoked: true },
    });

    return result.count;
  }

  async isTokenValid(token: string): Promise<boolean> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!refreshToken || refreshToken.revoked) {
      return false;
    }

    if (refreshToken.expiresAt < new Date()) {
      await this.revokeToken(refreshToken.id);
      return false;
    }

    return true;
  }

  async deleteExpiredTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    return result.count;
  }

  async findUserTokens(
    userId: string,
    includeRevoked: boolean = false,
  ): Promise<RefreshToken[]> {
    return await this.prisma.refreshToken.findMany({
      where: {
        userId,
        ...(includeRevoked ? {} : { revoked: false }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
