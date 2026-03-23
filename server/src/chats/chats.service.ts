// src/chat/chat.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ChatRepository } from '../common/repositories/chat.repository';
import { MessageRepository } from '../common/repositories/message.repository';
import { ChatMapper } from './mapper/chat.mapper';
import { UserRepository } from '../common/repositories/user.repository';
import { BlacklistRepository } from '../common/repositories/blacklist.repository';
import {
  CreateChatDto,
  SendMessageDto,
  GetMessagesQueryDto,
} from './dto/chat.dto';
import {
  ChatResponseDto,
  MessageResponseDto,
  ChatListResponseDto,
  DeleteChatResponseDto,
} from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepo: ChatRepository,
    private readonly messageRepo: MessageRepository,
    private readonly userRepo: UserRepository,
    private readonly blacklistRepo: BlacklistRepository,
    private readonly mapper: ChatMapper,
  ) {}

  async getUserChats(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<ChatListResponseDto> {
    const [chats, total] = await Promise.all([
      this.chatRepo.findUserChatsWithLastMessage(userId, limit, offset),
      this.chatRepo.countUserChats(userId),
    ]);

    return this.mapper.toChatListResponse(chats, userId, total);
  }

  async getChatById(chatId: string, userId: string): Promise<ChatResponseDto> {
    const chat = await this.chatRepo.findById(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    // Check if user is part of this chat
    if (chat.user1Id !== userId && chat.user2Id !== userId) {
      throw new ForbiddenException('You do not have access to this chat');
    }

    const unreadCount = await this.messageRepo.getUnreadCount(chatId, userId);
    const lastMessage = await this.messageRepo.getLastMessage(chatId);

    let lastMessageWithSender;
    if (lastMessage) {
      lastMessageWithSender = await this.messageRepo.findById(lastMessage.id);
    }

    return this.mapper.toChatResponse(
      chat,
      userId,
      lastMessageWithSender,
      unreadCount,
    );
  }

  async createChat(
    currentUserId: string,
    createChatDto: CreateChatDto,
  ): Promise<ChatResponseDto> {
    const { targetUserId } = createChatDto;

    if (currentUserId === targetUserId) {
      throw new BadRequestException('Cannot create chat with yourself');
    }

    // Check if target user exists
    const targetUser = await this.userRepo.findUnique({ id: targetUserId });
    if (!targetUser) {
      throw new NotFoundException(`User with ID ${targetUserId} not found`);
    }

    // Check if users are blocked
    const isBlocked = await this.blacklistRepo.checkBlocked(
      currentUserId,
      targetUserId,
    );
    if (isBlocked) {
      throw new ForbiddenException('Cannot create chat with blocked user');
    }

    // Check if chat already exists
    const existingChat = await this.chatRepo.findChatBetweenUsers(
      currentUserId,
      targetUserId,
    );
    if (existingChat) {
      const chatWithUsers = await this.chatRepo.findById(existingChat.id);
      return this.mapper.toChatResponse(chatWithUsers!, currentUserId);
    }

    // Create new chat
    const chat = await this.chatRepo.create(currentUserId, targetUserId);
    return this.mapper.toChatResponse(chat, currentUserId);
  }

  async deleteChat(
    chatId: string,
    userId: string,
  ): Promise<DeleteChatResponseDto> {
    const chat = await this.chatRepo.findById(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    // Check if user is part of this chat
    if (chat.user1Id !== userId && chat.user2Id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this chat',
      );
    }

    // Delete all messages in the chat
    await this.messageRepo.deleteChatMessages(chatId);

    // Delete the chat
    await this.chatRepo.delete(chatId);

    return {
      message: 'Chat deleted successfully',
      chatId,
    };
  }

  async getChatMessages(
    chatId: string,
    userId: string,
    query: GetMessagesQueryDto,
  ): Promise<MessageResponseDto[]> {
    const { limit = 50, offset = 0, before } = query;

    // Verify chat exists and user has access
    const chat = await this.chatRepo.findById(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    if (chat.user1Id !== userId && chat.user2Id !== userId) {
      throw new ForbiddenException('You do not have access to this chat');
    }

    // Get messages
    const messages = await this.messageRepo.findMessagesByChatId(chatId, {
      limit,
      offset,
      before,
    });

    return messages.map((msg) => this.mapper.toMessageResponse(msg));
  }

  async sendMessage(
    chatId: string,
    userId: string,
    sendMessageDto: SendMessageDto,
  ): Promise<MessageResponseDto> {
    const { text, fileUrl, fileType, encrypted = true } = sendMessageDto;

    if (!text && !fileUrl) {
      throw new BadRequestException('Message must contain either text or file');
    }

    // Verify chat exists and user has access
    const chat = await this.chatRepo.findById(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    if (chat.user1Id !== userId && chat.user2Id !== userId) {
      throw new ForbiddenException('You do not have access to this chat');
    }

    // Check if users are blocked
    const otherUserId = chat.user1Id === userId ? chat.user2Id : chat.user1Id;
    const isBlocked = await this.blacklistRepo.checkBlocked(
      userId,
      otherUserId,
    );
    if (isBlocked) {
      throw new ForbiddenException('Cannot send message to blocked user');
    }

    // Create message
    const message = await this.messageRepo.create(chatId, userId, {
      text,
      fileUrl,
      fileType,
      encrypted,
    });

    // Update chat timestamp
    await this.chatRepo.updateChatTimestamp(chatId);

    return this.mapper.toMessageResponse(message);
  }

  async deleteMessage(
    messageId: string,
    userId: string,
  ): Promise<{ message: string; messageId: string }> {
    const message = await this.messageRepo.findById(messageId);
    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    // Check if user is the sender
    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.messageRepo.delete(messageId);

    return {
      message: 'Message deleted successfully',
      messageId,
    };
  }

  async getUnreadCount(
    userId: string,
  ): Promise<{ total: number; chats: Record<string, number> }> {
    const chats = await this.chatRepo.findUserChats(userId);
    const unreadCounts: Record<string, number> = {};
    let total = 0;

    for (const chat of chats) {
      const count = await this.messageRepo.getUnreadCount(chat.id, userId);
      unreadCounts[chat.id] = count;
      total += count;
    }

    return {
      total,
      chats: unreadCounts,
    };
  }
}
