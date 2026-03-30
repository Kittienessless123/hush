// src/common/repositories/blacklist.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Blacklist, Prisma } from '@prisma/client';

export interface BlacklistWithUser extends Blacklist {
  blocked: {
    id: string;
    username: string;
    login: string;
    email: string | null;
    avatar: string | null;
    onlineStatus: boolean;
  };
}

@Injectable()
export class BlacklistRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findUnique(
    where: Prisma.BlacklistWhereUniqueInput,
  ): Promise<Blacklist | null> {
    return this.prisma.blacklist.findUnique({ where });
  }

  async findMany(params?: {
    where?: Prisma.BlacklistWhereInput;
    skip?: number;
    take?: number;
  }): Promise<Blacklist[]> {
    return this.prisma.blacklist.findMany(params);
  }

  async create(data: Prisma.BlacklistCreateInput): Promise<Blacklist> {
    return this.prisma.blacklist.create({ data });
  }

  async update(
    where: Prisma.BlacklistWhereUniqueInput,
    data: Prisma.BlacklistUpdateInput,
  ): Promise<Blacklist> {
    const entity = await this.findUnique(where);
    if (!entity) {
      throw new NotFoundException(`Blacklist entry not found`);
    }
    return this.prisma.blacklist.update({ where, data });
  }

  async delete(where: Prisma.BlacklistWhereUniqueInput): Promise<Blacklist> {
    const entity = await this.findUnique(where);
    if (!entity) {
      throw new NotFoundException(`Blacklist entry not found`);
    }
    return this.prisma.blacklist.delete({ where });
  }

  async findBlock(
    blockerId: string,
    blockedId: string,
  ): Promise<Blacklist | null> {
    return this.prisma.blacklist.findUnique({
      where: {
        blockerId_blockedId: { blockerId, blockedId },
      },
    });
  }

  async getUserBlacklist(userId: string): Promise<BlacklistWithUser[]> {
    const results = await this.prisma.blacklist.findMany({
      where: { blockerId: userId },
      include: {
        blocked: {
          select: {
            id: true,
            username: true,
            login: true,
            email: true,
            avatar: true,
            onlineStatus: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return results as BlacklistWithUser[];
  }

  async checkBlocked(userId1: string, userId2: string): Promise<boolean> {
    const block = await this.prisma.blacklist.findFirst({
      where: {
        OR: [
          { blockerId: userId1, blockedId: userId2 },
          { blockerId: userId2, blockedId: userId1 },
        ],
      },
    });
    return !!block;
  }
}
