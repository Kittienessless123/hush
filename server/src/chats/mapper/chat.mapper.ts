/* eslint-disable @typescript-eslint/no-unused-vars */
// src/chat/mappers/chat.mapper.ts
import { Injectable } from '@nestjs/common';
import {
  ChatResponseDto,
  UserInChatDto,
  MessageInChatDto,
  ChatListResponseDto,
} from '../dto/chat.dto';
import {
  ChatWithUsers,
  ChatWithLastMessage,
} from '../../common/repositories/chat.repository';
import { MessageWithSender } from '../../common/repositories/message.repository';

@Injectable()
export class ChatMapper {
  toUserInChat(user: {
    id: string;
    username: string;
    login: string;
    avatar: string | null;
    onlineStatus: boolean;
    lastSeen: Date | null;
  }): UserInChatDto {
    return {
      id: user.id,
      username: user.username,
      login: user.login,
      avatar: user.avatar ?? undefined,
      onlineStatus: user.onlineStatus,
      lastSeen: user.lastSeen ?? undefined,
    };
  }

  toChatResponse(
    chat: ChatWithUsers,
    currentUserId?: string,
    lastMessage?: any,
    unreadCount?: number,
  ): ChatResponseDto {
    return {
      id: chat.id,
      user1Id: chat.user1Id,
      user2Id: chat.user2Id,
      user1: this.toUserInChat(chat.user1),
      user2: this.toUserInChat(chat.user2),
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      lastMessage: lastMessage ? this.toMessageInChat(lastMessage) : undefined,
      unreadCount,
    };
  }

  toChatResponseWithLastMessage(
    chat: ChatWithLastMessage,
    currentUserId: string,
  ): ChatResponseDto {
    return {
      id: chat.id,
      user1Id: chat.user1Id,
      user2Id: chat.user2Id,
      user1: this.toUserInChat(chat.user1),
      user2: this.toUserInChat(chat.user2),
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      lastMessage: chat.lastMessage
        ? {
            id: chat.lastMessage.id,
            chatId: chat.id,
            senderId: chat.lastMessage.senderId,
            text: chat.lastMessage.text ?? undefined,
            encrypted: true,
            createdAt: chat.lastMessage.createdAt,
            updatedAt: chat.lastMessage.createdAt,
          }
        : undefined,
    };
  }

  toMessageInChat(message: MessageWithSender): MessageInChatDto {
    return {
      id: message.id,
      chatId: message.chatId,
      senderId: message.senderId,
      text: message.text ?? undefined,
      fileUrl: message.fileUrl ?? undefined,
      fileType: message.fileType ?? undefined,
      encrypted: message.encrypted,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      sender: message.sender
        ? {
            id: message.sender.id,
            username: message.sender.username,
            login: message.sender.login,
            avatar: message.sender.avatar ?? undefined,
            onlineStatus: false, // We don't have this in message sender
            lastSeen: undefined,
          }
        : undefined,
    };
  }

  toMessageResponse(message: MessageWithSender): MessageInChatDto {
    return this.toMessageInChat(message);
  }

  toChatListResponse(
    chats: ChatWithLastMessage[],
    currentUserId: string,
    total: number,
  ): ChatListResponseDto {
    return {
      chats: chats.map((chat) =>
        this.toChatResponseWithLastMessage(chat, currentUserId),
      ),
      total,
    };
  }
}
