// src/common/repositories/base.repository.ts
import { NotFoundException } from '@nestjs/common/exceptions';
import { PrismaService } from '../../prisma/prisma.service';

export abstract class BaseRepository<T, WhereInput, CreateInput, UpdateInput> {
  constructor(protected readonly prisma: PrismaService) {}

  abstract findUnique(where: WhereInput): Promise<T | null>;
  abstract findMany(params?: {
    where?: WhereInput;
    skip?: number;
    take?: number;
  }): Promise<T[]>;
  abstract create(data: CreateInput): Promise<T>;
  abstract update(where: WhereInput, data: UpdateInput): Promise<T>;
  abstract delete(where: WhereInput): Promise<T>;

  protected handleNotFound(entity: T | null, id?: string): asserts entity is T {
    if (!entity) {
      throw new NotFoundException(
        `${this.constructor.name.replace('Repository', '')} not found${id ? ` with ID ${id}` : ''}`,
      );
    }
  }
}
