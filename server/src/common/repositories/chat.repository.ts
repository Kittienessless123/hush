// src/common/repositories/chat.repository.ts (или src/chat/repositories/chat.repository.ts)
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Chat, Prisma } from '@prisma/client';

export interface ChatWithUsers {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: Date;
  updatedAt: Date;
  user1: {
    id: string;
    username: string;
    login: string;
    avatar: string | null;
    onlineStatus: boolean;
    lastSeen: Date | null;
  };
  user2: {
    id: string;
    username: string;
    login: string;
    avatar: string | null;
    onlineStatus: boolean;
    lastSeen: Date | null;
  };
}

export interface ChatWithLastMessage extends ChatWithUsers {
  lastMessage?: {
    id: string;
    text: string | null;
    createdAt: Date;
    senderId: string;
  };
}

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ChatWithUsers | null> {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            login: true,
            avatar: true,
            onlineStatus: true,
            lastSeen: true,
          },
        },
        user2: {
          select: {
            id: true,
            username: true,
            login: true,
            avatar: true,
            onlineStatus: true,
            lastSeen: true,
          },
        },
      },
    });

    if (!chat) return null;

    return {
      id: chat.id,
      user1Id: chat.user1Id,
      user2Id: chat.user2Id,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      user1: {
        id: chat.user1.id,
        username: chat.user1.username,
        login: chat.user1.login,
        avatar: chat.user1.avatar,
        onlineStatus: chat.user1.onlineStatus,
        lastSeen: chat.user1.lastSeen,
      },
      user2: {
        id: chat.user2.id,
        username: chat.user2.username,
        login: chat.user2.login,
        avatar: chat.user2.avatar,
        onlineStatus: chat.user2.onlineStatus,
        lastSeen: chat.user2.lastSeen,
      },
    };
  }

  async findChatBetweenUsers(
    userId1: string,
    userId2: string,
  ): Promise<Chat | null> {
    return this.prisma.chat.findFirst({
      where: {
        OR: [
          { user1Id: userId1, user2Id: userId2 },
          { user1Id: userId2, user2Id: userId1 },
        ],
      },
    });
  }

  async findChatBetweenUsersWithDetails(
    userId1: string,
    userId2: string,
  ): Promise<ChatWithUsers | null> {
    const chat = await this.prisma.chat.findFirst({
      where: {
        OR: [
          { user1Id: userId1, user2Id: userId2 },
          { user1Id: userId2, user2Id: userId1 },
        ],
      },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            login: true,
            avatar: true,
            onlineStatus: true,
            lastSeen: true,
          },
        },
        user2: {
          select: {
            id: true,
            username: true,
            login: true,
            avatar: true,
            onlineStatus: true,
            lastSeen: true,
          },
        },
      },
    });

    if (!chat) return null;

    return {
      id: chat.id,
      user1Id: chat.user1Id,
      user2Id: chat.user2Id,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      user1: {
        id: chat.user1.id,
        username: chat.user1.username,
        login: chat.user1.login,
        avatar: chat.user1.avatar,
        onlineStatus: chat.user1.onlineStatus,
        lastSeen: chat.user1.lastSeen,
      },
      user2: {
        id: chat.user2.id,
        username: chat.user2.username,
        login: chat.user2.login,
        avatar: chat.user2.avatar,
        onlineStatus: chat.user2.onlineStatus,
        lastSeen: chat.user2.lastSeen,
      },
    };
  }

  async findUserChats(userId: string): Promise<ChatWithUsers[]> {
    const chats = await this.prisma.chat.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            login: true,
            avatar: true,
            onlineStatus: true,
            lastSeen: true,
          },
        },
        user2: {
          select: {
            id: true,
            username: true,
            login: true,
            avatar: true,
            onlineStatus: true,
            lastSeen: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return chats.map((chat) => ({
      id: chat.id,
      user1Id: chat.user1Id,
      user2Id: chat.user2Id,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      user1: {
        id: chat.user1.id,
        username: chat.user1.username,
        login: chat.user1.login,
        avatar: chat.user1.avatar,
        onlineStatus: chat.user1.onlineStatus,
        lastSeen: chat.user1.lastSeen,
      },
      user2: {
        id: chat.user2.id,
        username: chat.user2.username,
        login: chat.user2.login,
        avatar: chat.user2.avatar,
        onlineStatus: chat.user2.onlineStatus,
        lastSeen: chat.user2.lastSeen,
      },
    }));
  }

  async findUserChatsWithLastMessage(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<ChatWithLastMessage[]> {
    const chats = await this.prisma.chat.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            login: true,
            avatar: true,
            onlineStatus: true,
            lastSeen: true,
          },
        },
        user2: {
          select: {
            id: true,
            username: true,
            login: true,
            avatar: true,
            onlineStatus: true,
            lastSeen: true,
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            text: true,
            createdAt: true,
            senderId: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip: offset,
      take: limit,
    });

    return chats.map((chat) => ({
      id: chat.id,
      user1Id: chat.user1Id,
      user2Id: chat.user2Id,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      user1: {
        id: chat.user1.id,
        username: chat.user1.username,
        login: chat.user1.login,
        avatar: chat.user1.avatar,
        onlineStatus: chat.user1.onlineStatus,
        lastSeen: chat.user1.lastSeen,
      },
      user2: {
        id: chat.user2.id,
        username: chat.user2.username,
        login: chat.user2.login,
        avatar: chat.user2.avatar,
        onlineStatus: chat.user2.onlineStatus,
        lastSeen: chat.user2.lastSeen,
      },
      lastMessage: chat.messages[0]
        ? {
            id: chat.messages[0].id,
            text: chat.messages[0].text,
            createdAt: chat.messages[0].createdAt,
            senderId: chat.messages[0].senderId,
          }
        : undefined,
    }));
  }

  async create(user1Id: string, user2Id: string): Promise<ChatWithUsers> {
    const chat = await this.prisma.chat.create({
      data: {
        user1Id,
        user2Id,
      },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            login: true,
            avatar: true,
            onlineStatus: true,
            lastSeen: true,
          },
        },
        user2: {
          select: {
            id: true,
            username: true,
            login: true,
            avatar: true,
            onlineStatus: true,
            lastSeen: true,
          },
        },
      },
    });

    return {
      id: chat.id,
      user1Id: chat.user1Id,
      user2Id: chat.user2Id,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      user1: {
        id: chat.user1.id,
        username: chat.user1.username,
        login: chat.user1.login,
        avatar: chat.user1.avatar,
        onlineStatus: chat.user1.onlineStatus,
        lastSeen: chat.user1.lastSeen,
      },
      user2: {
        id: chat.user2.id,
        username: chat.user2.username,
        login: chat.user2.login,
        avatar: chat.user2.avatar,
        onlineStatus: chat.user2.onlineStatus,
        lastSeen: chat.user2.lastSeen,
      },
    };
  }

  async delete(id: string): Promise<Chat> {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
    });

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }

    return this.prisma.chat.delete({
      where: { id },
    });
  }

  async updateChatTimestamp(chatId: string): Promise<void> {
    await this.prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });
  }

  async countUserChats(userId: string): Promise<number> {
    return this.prisma.chat.count({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    });
  }

  async chatExists(userId1: string, userId2: string): Promise<boolean> {
    const count = await this.prisma.chat.count({
      where: {
        OR: [
          { user1Id: userId1, user2Id: userId2 },
          { user1Id: userId2, user2Id: userId1 },
        ],
      },
    });
    return count > 0;
  }
}
