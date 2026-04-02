// src/chats/chats.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateChatDto,
  SendMessageDto,
  GetMessagesQueryDto,
} from './dto/chat.dto';
import {
  ChatResponseDto,
  MessageResponseDto,
  ChatListResponseDto,
} from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserChats(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<ChatListResponseDto> {
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
          orderBy: { createdAt: 'desc' },
          take: 1,
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
        },
      },
      orderBy: { updatedAt: 'desc' },
      skip: offset,
      take: limit,
    });

    const total = await this.prisma.chat.count({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    });

    return {
      chats: chats.map((chat) => ({
        id: chat.id,
        user1Id: chat.user1Id,
        user2Id: chat.user2Id,
        user1: {
          id: chat.user1.id,
          username: chat.user1.username,
          login: chat.user1.login,
          avatar: chat.user1.avatar,
          onlineStatus: chat.user1.onlineStatus,
          lastSeen: chat.user1.lastSeen || undefined,
        },
        user2: {
          id: chat.user2.id,
          username: chat.user2.username,
          login: chat.user2.login,
          avatar: chat.user2.avatar,
          onlineStatus: chat.user2.onlineStatus,
          lastSeen: chat.user2.lastSeen || undefined,
        },
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        lastMessage: chat.messages[0]
          ? {
              id: chat.messages[0].id,
              chatId: chat.messages[0].chatId,
              senderId: chat.messages[0].senderId,
              text: chat.messages[0].text,
              fileUrl: chat.messages[0].fileUrl,
              fileType: chat.messages[0].fileType,
              encrypted: chat.messages[0].encrypted,
              createdAt: chat.messages[0].createdAt,
              updatedAt: chat.messages[0].updatedAt,
              sender: chat.messages[0].sender
                ? {
                    id: chat.messages[0].sender.id,
                    username: chat.messages[0].sender.username,
                    login: chat.messages[0].sender.login,
                    avatar: chat.messages[0].sender.avatar,
                    onlineStatus: false,
                  }
                : undefined,
            }
          : null,
      })),
      total,
      limit: limit || total,
      offset: offset || 0,
    };
  }

  async getChatById(chatId: string, userId: string): Promise<ChatResponseDto> {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
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

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.user1Id !== userId && chat.user2Id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return {
      id: chat.id,
      user1Id: chat.user1Id,
      user2Id: chat.user2Id,
      user1: {
        id: chat.user1.id,
        username: chat.user1.username,
        login: chat.user1.login,
        avatar: chat.user1.avatar,
        onlineStatus: chat.user1.onlineStatus,
        lastSeen: chat.user1.lastSeen || undefined,
      },
      user2: {
        id: chat.user2.id,
        username: chat.user2.username,
        login: chat.user2.login,
        avatar: chat.user2.avatar,
        onlineStatus: chat.user2.onlineStatus,
        lastSeen: chat.user2.lastSeen || undefined,
      },
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  }

  async createChat(
    userId: string,
    dto: CreateChatDto,
  ): Promise<ChatResponseDto> {
    const targetUserId = dto.targetUserId; // 👈 Исправлено

    if (userId === targetUserId) {
      throw new BadRequestException('Cannot create chat with yourself');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    // Проверяем, не заблокирован ли пользователь
    const isBlocked = await this.prisma.blacklist.findFirst({
      where: {
        OR: [
          { blockerId: userId, blockedId: targetUserId },
          { blockerId: targetUserId, blockedId: userId },
        ],
      },
    });

    if (isBlocked) {
      throw new ForbiddenException('Cannot create chat with blocked user');
    }

    // Проверяем, существует ли уже чат
    const existingChat = await this.prisma.chat.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: targetUserId },
          { user1Id: targetUserId, user2Id: userId },
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

    if (existingChat) {
      return {
        id: existingChat.id,
        user1Id: existingChat.user1Id,
        user2Id: existingChat.user2Id,
        user1: {
          id: existingChat.user1.id,
          username: existingChat.user1.username,
          login: existingChat.user1.login,
          avatar: existingChat.user1.avatar,
          onlineStatus: existingChat.user1.onlineStatus,
          lastSeen: existingChat.user1.lastSeen || undefined,
        },
        user2: {
          id: existingChat.user2.id,
          username: existingChat.user2.username,
          login: existingChat.user2.login,
          avatar: existingChat.user2.avatar,
          onlineStatus: existingChat.user2.onlineStatus,
          lastSeen: existingChat.user2.lastSeen || undefined,
        },
        createdAt: existingChat.createdAt,
        updatedAt: existingChat.updatedAt,
      };
    }

    const chat = await this.prisma.chat.create({
      data: {
        user1Id: userId,
        user2Id: targetUserId,
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
      user1: {
        id: chat.user1.id,
        username: chat.user1.username,
        login: chat.user1.login,
        avatar: chat.user1.avatar,
        onlineStatus: chat.user1.onlineStatus,
        lastSeen: chat.user1.lastSeen || undefined,
      },
      user2: {
        id: chat.user2.id,
        username: chat.user2.username,
        login: chat.user2.login,
        avatar: chat.user2.avatar,
        onlineStatus: chat.user2.onlineStatus,
        lastSeen: chat.user2.lastSeen || undefined,
      },
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  }

  async deleteChat(
    chatId: string,
    userId: string,
  ): Promise<{ message: string; chatId: string }> {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.user1Id !== userId && chat.user2Id !== userId) {
      throw new ForbiddenException('Permission denied');
    }

    await this.prisma.chat.delete({
      where: { id: chatId },
    });

    return { message: 'Chat deleted successfully', chatId };
  }

  async getChatMessages(
    chatId: string,
    userId: string,
    query: GetMessagesQueryDto,
  ): Promise<MessageResponseDto[]> {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.user1Id !== userId && chat.user2Id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const limit = query.limit || 50;
    const offset = query.offset || 0;

    const messages = await this.prisma.message.findMany({
      where: { chatId },
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
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });

    return messages.reverse().map((msg) => ({
      id: msg.id,
      chatId: msg.chatId,
      senderId: msg.senderId,
      text: msg.text,
      fileUrl: msg.fileUrl,
      fileType: msg.fileType,
      encrypted: msg.encrypted,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      sender: msg.sender
        ? {
            id: msg.sender.id,
            username: msg.sender.username,
            login: msg.sender.login,
            avatar: msg.sender.avatar,
            onlineStatus: false,
          }
        : undefined,
    }));
  }

  async sendMessage(
    chatId: string,
    userId: string,
    dto: SendMessageDto,
    file?: Express.Multer.File,
  ): Promise<MessageResponseDto> {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.user1Id !== userId && chat.user2Id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (!dto.text && !file) {
      throw new BadRequestException('Message must contain text or file');
    }

    let fileUrl: string | null = null;
    let fileType: string | null = null;

    if (file) {
      fileUrl = `/uploads/${Date.now()}-${file.originalname}`;
      fileType = file.mimetype;
    }

    const message = await this.prisma.message.create({
      data: {
        chatId,
        senderId: userId,
        text: dto.text || null,
        fileUrl,
        fileType,
        encrypted: dto.encrypted ?? true,
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

    // Обновляем updatedAt чата
    await this.prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    return {
      id: message.id,
      chatId: message.chatId,
      senderId: message.senderId,
      text: message.text,
      fileUrl: message.fileUrl,
      fileType: message.fileType,
      encrypted: message.encrypted,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      sender: message.sender
        ? {
            id: message.sender.id,
            username: message.sender.username,
            login: message.sender.login,
            avatar: message.sender.avatar,
            onlineStatus: false,
          }
        : undefined,
    };
  }

  async deleteMessage(
    messageId: string,
    userId: string,
  ): Promise<{ message: string; messageId: string }> {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('Can only delete own messages');
    }

    await this.prisma.message.delete({
      where: { id: messageId },
    });

    return { message: 'Message deleted successfully', messageId };
  }

  async getUnreadCount(
    userId: string,
  ): Promise<{ total: number; chats: Record<string, number> }> {
    const chats = await this.prisma.chat.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      select: { id: true },
    });

    const unreadCounts: Record<string, number> = {};
    let total = 0;

    for (const chat of chats) {
      const count = await this.prisma.message.count({
        where: {
          chatId: chat.id,
          senderId: { not: userId },
          // TODO: Добавить поле readAt когда будет реализовано
        },
      });

      if (count > 0) {
        unreadCounts[chat.id] = count;
        total += count;
      }
    }

    return { total, chats: unreadCounts };
  }
}
