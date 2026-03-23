// src/common/repositories/settings.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserSettings, Prisma } from '../../generated/client';

@Injectable()
export class SettingsRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findUnique(
    where: Prisma.UserSettingsWhereUniqueInput,
  ): Promise<UserSettings | null> {
    return this.prisma.userSettings.findUnique({ where });
  }

  async findMany(params?: {
    where?: Prisma.UserSettingsWhereInput;
  }): Promise<UserSettings[]> {
    return this.prisma.userSettings.findMany(params);
  }

  async create(data: Prisma.UserSettingsCreateInput): Promise<UserSettings> {
    return this.prisma.userSettings.create({ data });
  }

  async update(
    where: Prisma.UserSettingsWhereUniqueInput,
    data: Prisma.UserSettingsUpdateInput,
  ): Promise<UserSettings> {
    const entity = await this.findUnique(where);
    if (!entity) {
      throw new NotFoundException(`Settings not found`);
    }
    return this.prisma.userSettings.update({ where, data });
  }

  async delete(
    where: Prisma.UserSettingsWhereUniqueInput,
  ): Promise<UserSettings> {
    const entity = await this.findUnique(where);
    if (!entity) {
      throw new NotFoundException(`Settings not found`);
    }
    return this.prisma.userSettings.delete({ where });
  }

  async findByUserId(userId: string): Promise<UserSettings | null> {
    return this.prisma.userSettings.findUnique({
      where: { userId },
    });
  }
}
