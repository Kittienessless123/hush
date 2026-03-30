/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/common/repositories/user.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, User, UserSettings } from '@prisma/client';

export type UserWithSettings = User & {
  settings: UserSettings | null;
};

export interface UserFindUniqueInput {
  id?: string;
  username?: string;
  email?: string;
  login?: string;
}

export interface UserCreateInput {
  username: string;
  login: string;
  passwordHash: string;
  email: string;
  publicKey?: string | null;
}

export interface UserUpdateInput {
  username?: string;
  email?: string;
  avatar?: string | null;
  publicKey?: string | null;
  description?: string | null;
  phone?: string | null;
  lastSeen?: Date | null;
  onlineStatus?: boolean;
  passwordHash?: string;
}

export interface UserWhereInput {
  id?: string;
  username?: string;
  email?: string;
  login?: string;
  NOT?: UserWhereInput;
  AND?: UserWhereInput[];
  OR?: UserWhereInput[];
}

@Injectable()
export class UserRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findUnique(
    where: UserFindUniqueInput,
  ): Promise<UserWithSettings | null> {
    return await this.prisma.user.findUnique({
      where: where as Prisma.UserWhereUniqueInput,
      include: { settings: true },
    });
  }

  async findMany(params?: {
    where?: Prisma.UserWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<UserWithSettings[]> {
    return await this.prisma.user.findMany({
      ...params,
      include: { settings: true },
    });
  }

  async create(data: UserCreateInput): Promise<UserWithSettings> {
    return await this.prisma.user.create({
      data: {
        username: data.username,
        login: data.login,
        passwordHash: data.passwordHash,
        email: data.email,
        publicKey: data.publicKey ?? null,
        settings: {
          create: {
            theme: 'system',
            language: 'en',
            notifications: { sound: true, popup: true, preview: true },
            privacy: {
              lastSeen: 'everyone',
              readReceipts: true,
              onlineStatus: true,
            },
            twoFactorAuth: false,
          },
        },
      },
      include: { settings: true },
    });
  }

  async update(
    where: UserFindUniqueInput,
    data: UserUpdateInput,
  ): Promise<UserWithSettings> {
    const user = await this.findUnique(where);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return this.prisma.user.update({
      where: where as Prisma.UserWhereUniqueInput,
      data: {
        username: data.username,
        email: data.email,
        avatar: data.avatar,
        publicKey: data.publicKey,
        description: data.description,
        phone: data.phone,
        lastSeen: data.lastSeen,
        onlineStatus: data.onlineStatus,
        passwordHash: data.passwordHash,
      },
      include: { settings: true },
    });
  }

  async delete(where: UserFindUniqueInput): Promise<UserWithSettings> {
    const user = await this.findUnique(where);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return this.prisma.user.delete({
      where: where as Prisma.UserWhereUniqueInput,
      include: { settings: true },
    });
  }

  async findByCredentials(
    loginOrEmail: string,
  ): Promise<UserWithSettings | null> {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ login: loginOrEmail }, { email: loginOrEmail }],
      },
      include: { settings: true },
    });
  }

  async exists(where: UserFindUniqueInput): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: where as Prisma.UserWhereInput,
    });
    return count > 0;
  }

  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return await this.prisma.user.count({ where });
  }

  async checkUnique(
    data: { username?: string; email?: string; login?: string },
    excludeId?: string,
  ): Promise<{ isUnique: boolean; conflictField?: string }> {
    if (!data.username && !data.email && !data.login) {
      return { isUnique: true };
    }

    const where: Prisma.UserWhereInput = {
      OR: [
        data.username && { username: data.username },
        data.email && { email: data.email },
        data.login && { login: data.login },
      ].filter(Boolean) as Prisma.UserWhereInput[],
    };

    if (excludeId) {
      where.NOT = { id: excludeId };
    }

    const existing = await this.prisma.user.findFirst({ where });

    if (!existing) return { isUnique: true };

    if (existing.username === data.username)
      return { isUnique: false, conflictField: 'username' };
    if (existing.email === data.email)
      return { isUnique: false, conflictField: 'email' };
    if (existing.login === data.login)
      return { isUnique: false, conflictField: 'login' };

    return { isUnique: true };
  }
}
