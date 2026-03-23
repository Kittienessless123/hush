// src/token/repositories/token.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RefreshToken, Prisma } from '../../generated/client';

export interface CreateTokenData {
  userId: string;
  token: string;
  expiresAt: Date;
  deviceInfo?: string | null;
  ipAddress?: string | null;
}

export interface TokenWithUser extends RefreshToken {
  user: {
    id: string;
    username: string;
    login: string;
    email: string | null;
  };
}

@Injectable()
export class TokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTokenData): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data: {
        userId: data.userId,
        token: data.token,
        expiresAt: data.expiresAt,
        deviceInfo: data.deviceInfo,
        // ipAddress не в схеме, убираем или добавляем в схему
      },
    });
  }

  async findUnique(
    where: Prisma.RefreshTokenWhereUniqueInput,
  ): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({ where });
  }

  async findFirst(
    where: Prisma.RefreshTokenWhereInput,
  ): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findFirst({ where });
  }

  async findMany(params?: {
    where?: Prisma.RefreshTokenWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.RefreshTokenOrderByWithRelationInput;
  }): Promise<RefreshToken[]> {
    return this.prisma.refreshToken.findMany(params);
  }

  async findByIdWithUser(id: string): Promise<TokenWithUser | null> {
    const result = await this.prisma.refreshToken.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            login: true,
            email: true,
          },
        },
      },
    });

    return result as TokenWithUser | null;
  }

  async findByToken(token: string): Promise<TokenWithUser | null> {
    const result = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            login: true,
            email: true,
          },
        },
      },
    });

    return result as TokenWithUser | null;
  }

  async findUserTokens(
    userId: string,
    includeRevoked: boolean = false,
  ): Promise<RefreshToken[]> {
    return this.prisma.refreshToken.findMany({
      where: {
        userId,
        ...(includeRevoked ? {} : { revoked: false }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(
    where: Prisma.RefreshTokenWhereUniqueInput,
    data: Prisma.RefreshTokenUpdateInput,
  ): Promise<RefreshToken> {
    const entity = await this.findUnique(where);
    if (!entity) {
      throw new NotFoundException(`Token not found`);
    }

    return this.prisma.refreshToken.update({
      where,
      data,
    });
  }

  async delete(
    where: Prisma.RefreshTokenWhereUniqueInput,
  ): Promise<RefreshToken> {
    const entity = await this.findUnique(where);
    if (!entity) {
      throw new NotFoundException(`Token not found`);
    }

    return this.prisma.refreshToken.delete({ where });
  }

  async revokeToken(tokenId: string): Promise<RefreshToken> {
    const token = await this.findUnique({ id: tokenId });
    if (!token) {
      throw new NotFoundException(`Token with ID ${tokenId} not found`);
    }

    return this.prisma.refreshToken.update({
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

  async deleteExpiredTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
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
}
