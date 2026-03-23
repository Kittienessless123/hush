// src/chat/repositories/chat.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Chat } from '../../generated/client';

export interface ChatWithUsers extends Chat {
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
    const result = await this.prisma.chat.findUnique({
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

    return result as ChatWithUsers | null;
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

  async findUserChats(userId: string): Promise<ChatWithUsers[]> {
    const results = await this.prisma.chat.findMany({
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

    return results as ChatWithUsers[];
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
      ...chat,
      lastMessage: chat.messages[0],
    })) as ChatWithLastMessage[];
  }

  async create(user1Id: string, user2Id: string): Promise<ChatWithUsers> {
    const result = await this.prisma.chat.create({
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

    return result as ChatWithUsers;
  }

  async delete(id: string): Promise<Chat> {
    const chat = await this.findById(id);
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
