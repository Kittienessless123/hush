// src/chats/dto/chat.dto.ts
import {
  IsUUID,
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsDate,
  IsBoolean,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Request DTOs
export class CreateChatDto {
  @ApiProperty({ description: 'ID of the user to start chat with' })
  @IsUUID()
  targetUserId: string; // 👈 Исправлено: targetUserId вместо user2Id
}

export class GetMessagesQueryDto {
  @ApiProperty({
    required: false,
    default: 50,
    description: 'Number of messages to return',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;

  @ApiProperty({
    required: false,
    default: 0,
    description: 'Number of messages to skip',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiProperty({
    required: false,
    description: 'Get messages before this date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  before?: Date;
}

export class SendMessageDto {
  @ApiPropertyOptional({ description: 'Message text' })
  @IsOptional()
  @IsString()
  text?: string; // 👈 Сделано опциональным для файлов

  @ApiProperty({
    required: false,
    default: true,
    description: 'Whether message is encrypted',
  })
  @IsOptional()
  @IsBoolean()
  encrypted?: boolean = true;
}

// Response DTOs
export class UserInChatDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  login: string;

  @ApiPropertyOptional()
  avatar?: string | null; // 👈 Исправлено: string | null

  @ApiProperty()
  onlineStatus: boolean;

  @ApiPropertyOptional()
  lastSeen?: Date;
}

export class MessageInChatDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  chatId: string;

  @ApiProperty()
  senderId: string;

  @ApiPropertyOptional()
  text?: string | null; // 👈 Исправлено: может быть null

  @ApiPropertyOptional()
  fileUrl?: string | null; // 👈 Исправлено: может быть null

  @ApiPropertyOptional()
  fileType?: string | null; // 👈 Исправлено: может быть null

  @ApiProperty()
  encrypted: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => UserInChatDto })
  sender?: UserInChatDto;
}

export class MessageResponseDto extends MessageInChatDto {}

export class ChatResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user1Id: string;

  @ApiProperty()
  user2Id: string;

  @ApiProperty({ type: () => UserInChatDto })
  user1: UserInChatDto;

  @ApiProperty({ type: () => UserInChatDto })
  user2: UserInChatDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => MessageInChatDto })
  lastMessage?: MessageInChatDto | null; // 👈 Исправлено: может быть null

  @ApiPropertyOptional()
  unreadCount?: number;
}

export class ChatListResponseDto {
  @ApiProperty({ type: [ChatResponseDto] })
  chats: ChatResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}

export class DeleteChatResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  chatId: string;
}
