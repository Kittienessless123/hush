// src/chat/dto/chat.dto.ts
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
import { ApiProperty } from '@nestjs/swagger';

// Request DTOs
export class CreateChatDto {
  @ApiProperty({ description: 'ID of the user to start chat with' })
  @IsUUID()
  targetUserId: string;
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
  @ApiProperty({ description: 'Message text' })
  @IsString()
  text: string;

  @ApiProperty({
    required: false,
    description: 'File URL if message contains file',
  })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiProperty({
    required: false,
    description: 'File type if message contains file',
  })
  @IsOptional()
  @IsString()
  fileType?: string;

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

  @ApiProperty()
  avatar?: string;

  @ApiProperty()
  onlineStatus: boolean;

  @ApiProperty()
  lastSeen?: Date;
}

export class ChatResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user1Id: string;

  @ApiProperty()
  user2Id: string;

  @ApiProperty({ type: () => UserInChatDto })
  @ValidateNested()
  @Type(() => UserInChatDto)
  user1: UserInChatDto;

  @ApiProperty({ type: () => UserInChatDto })
  @ValidateNested()
  @Type(() => UserInChatDto)
  user2: UserInChatDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false, description: 'Last message in chat' })
  @ValidateNested()
  @Type(() => MessageInChatDto)
  lastMessage?: MessageInChatDto;

  @ApiProperty({ description: 'Unread messages count for current user' })
  unreadCount?: number;
}

export class MessageInChatDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  chatId: string;

  @ApiProperty()
  senderId: string;

  @ApiProperty()
  text?: string;

  @ApiProperty()
  fileUrl?: string;

  @ApiProperty()
  fileType?: string;

  @ApiProperty()
  encrypted: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  sender?: UserInChatDto;
}

export class MessageResponseDto extends MessageInChatDto {}

export class ChatListResponseDto {
  @ApiProperty({ type: [ChatResponseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatResponseDto)
  chats: ChatResponseDto[];

  @ApiProperty()
  total: number;
}

export class DeleteChatResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  chatId: string;
}
