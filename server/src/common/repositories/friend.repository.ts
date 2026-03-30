import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Friend, FriendStatus, Prisma } from '@prisma/client';

export interface FriendWithUsers {
  id: string;
  userId: string;
  friendId: string;
  status: FriendStatus;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    username: string;
    login: string;
    email: string | null;
    avatar: string | null;
    onlineStatus: boolean;
    lastSeen: Date | null;
  };
  friend: {
    id: string;
    username: string;
    login: string;
    email: string | null;
    avatar: string | null;
    onlineStatus: boolean;
    lastSeen: Date | null;
  };
}

@Injectable()
export class FriendRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findUnique(
    where: Prisma.FriendWhereUniqueInput,
  ): Promise<Friend | null> {
    return this.prisma.friend.findUnique({ where });
  }

  async findMany(params?: {
    where?: Prisma.FriendWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.FriendOrderByWithRelationInput;
  }): Promise<Friend[]> {
    return this.prisma.friend.findMany(params);
  }

  async create(data: Prisma.FriendCreateInput): Promise<Friend> {
    return this.prisma.friend.create({ data });
  }

  async update(
    where: Prisma.FriendWhereUniqueInput,
    data: Prisma.FriendUpdateInput,
  ): Promise<Friend> {
    const entity = await this.findUnique(where);
    if (!entity) {
      throw new NotFoundException(`Friend relationship not found`);
    }
    return this.prisma.friend.update({ where, data });
  }

  async delete(where: Prisma.FriendWhereUniqueInput): Promise<Friend> {
    const entity = await this.findUnique(where);
    if (!entity) {
      throw new NotFoundException(`Friend relationship not found`);
    }
    return this.prisma.friend.delete({ where });
  }

  async findFriendship(
    userId1: string,
    userId2: string,
  ): Promise<Friend | null> {
    return this.prisma.friend.findFirst({
      where: {
        OR: [
          { userId: userId1, friendId: userId2 },
          { userId: userId2, friendId: userId1 },
        ],
      },
    });
  }

  async findFriendshipWithDetails(
    userId1: string,
    userId2: string,
  ): Promise<FriendWithUsers | null> {
    const result = await this.prisma.friend.findFirst({
      where: {
        OR: [
          { userId: userId1, friendId: userId2 },
          { userId: userId2, friendId: userId1 },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            login: true,
            email: true,
            avatar: true,
            onlineStatus: true,
            lastSeen: true,
          },
        },
        friend: {
          select: {
            id: true,
            username: true,
            login: true,
            email: true,
            avatar: true,
            onlineStatus: true,
            lastSeen: true,
          },
        },
      },
    });

    return result as FriendWithUsers | null;
  }

  async getUserFriends(
    userId: string,
    status?: FriendStatus,
  ): Promise<FriendWithUsers[]> {
    const results = await this.prisma.friend.findMany({
      where: {
        OR: [{ userId }, { friendId: userId }],
        ...(status && { status }),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            login: true,
            email: true,
            avatar: true,
            onlineStatus: true,
            lastSeen: true,
          },
        },
        friend: {
          select: {
            id: true,
            username: true,
            login: true,
            email: true,
            avatar: true,
            onlineStatus: true,
            lastSeen: true,
          },
        },
      },
    });

    return results as FriendWithUsers[];
  }

  async findRequestById(id: string): Promise<FriendWithUsers | null> {
    const result = await this.prisma.friend.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            login: true,
            email: true,
            avatar: true,
            onlineStatus: true,
            lastSeen: true,
          },
        },
        friend: {
          select: {
            id: true,
            username: true,
            login: true,
            email: true,
            avatar: true,
            onlineStatus: true,
            lastSeen: true,
          },
        },
      },
    });

    return result as FriendWithUsers | null;
  }

  async getUserRequests(
    userId: string,
    type: 'incoming' | 'outgoing',
  ): Promise<FriendWithUsers[]> {
    const where =
      type === 'incoming'
        ? { friendId: userId, status: 'pending' as FriendStatus }
        : { userId, status: 'pending' as FriendStatus };

    const results = await this.prisma.friend.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            login: true,
            email: true,
            avatar: true,
            onlineStatus: true,
            lastSeen: true,
          },
        },
        friend: {
          select: {
            id: true,
            username: true,
            login: true,
            email: true,
            avatar: true,
            onlineStatus: true,
            lastSeen: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return results as FriendWithUsers[];
  }
}
