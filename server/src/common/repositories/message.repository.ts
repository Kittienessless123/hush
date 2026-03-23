// src/chat/repositories/message.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Message, Prisma } from '../../generated/client';

export interface MessageWithSender extends Message {
  sender: {
    id: string;
    username: string;
    login: string;
    avatar: string | null;
  };
}

@Injectable()
export class MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<MessageWithSender | null> {
    const result = await this.prisma.message.findUnique({
      where: { id },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            login: true,
            avatar: true,
          },
        },
      },
    });

    return result as MessageWithSender | null;
  }

  async findMessagesByChatId(
    chatId: string,
    options?: {
      limit?: number;
      offset?: number;
      before?: Date;
    },
  ): Promise<MessageWithSender[]> {
    const where: Prisma.MessageWhereInput = {
      chatId,
    };

    if (options?.before) {
      where.createdAt = { lt: options.before };
    }

    const results = await this.prisma.message.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            login: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: options?.offset,
      take: options?.limit,
    });

    // Return in chronological order (oldest first)
    return results.reverse() as MessageWithSender[];
  }

  async create(
    chatId: string,
    senderId: string,
    data: {
      text?: string;
      fileUrl?: string;
      fileType?: string;
      encrypted?: boolean;
    },
  ): Promise<MessageWithSender> {
    const result = await this.prisma.message.create({
      data: {
        chatId,
        senderId,
        text: data.text,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        encrypted: data.encrypted ?? true,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            login: true,
            avatar: true,
          },
        },
      },
    });

    return result as MessageWithSender;
  }

  async delete(id: string): Promise<Message> {
    return this.prisma.message.delete({
      where: { id },
    });
  }

  async deleteChatMessages(chatId: string): Promise<number> {
    const result = await this.prisma.message.deleteMany({
      where: { chatId },
    });
    return result.count;
  }

  async countMessagesInChat(chatId: string): Promise<number> {
    return this.prisma.message.count({
      where: { chatId },
    });
  }

  async getLastMessage(chatId: string): Promise<Message | null> {
    return this.prisma.message.findFirst({
      where: { chatId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadCount(chatId: string, userId: string): Promise<number> {
    // In a real app, you'd track read receipts
    // For now, return total count or implement read tracking
    return this.prisma.message.count({
      where: {
        chatId,
        NOT: {
          senderId: userId,
        },
      },
    });
  }
}
