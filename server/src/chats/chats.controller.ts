/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// src/chat/chat.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChatService } from './chats.service';
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user/current-user.decorator';

@ApiTags('Chats')
@Controller('chats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @ApiOperation({ summary: 'Get all chats for current user' })
  @ApiResponse({
    status: 200,
    description: 'List of chats',
    type: ChatListResponseDto,
  })
  async getUserChats(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<ChatListResponseDto> {
    return this.chatService.getUserChats(
      currentUser.id,
      limit ? parseInt(limit) : undefined,
      offset ? parseInt(offset) : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chat by ID' })
  @ApiResponse({
    status: 200,
    description: 'Chat details',
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  async getChatById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<ChatResponseDto> {
    return this.chatService.getChatById(id, currentUser.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new chat' })
  @ApiResponse({
    status: 201,
    description: 'Chat created',
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Cannot create chat with yourself' })
  @ApiResponse({
    status: 403,
    description: 'Cannot create chat with blocked user',
  })
  @ApiResponse({ status: 404, description: 'Target user not found' })
  async createChat(
    @Body() createChatDto: CreateChatDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<ChatResponseDto> {
    return this.chatService.createChat(currentUser.id, createChatDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a chat' })
  @ApiResponse({
    status: 200,
    description: 'Chat deleted',
    type: DeleteChatResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Permission denied' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  async deleteChat(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<DeleteChatResponseDto> {
    return this.chatService.deleteChat(id, currentUser.id);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get messages in chat' })
  @ApiResponse({
    status: 200,
    description: 'List of messages',
    type: [MessageResponseDto],
  })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  async getChatMessages(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
    @Query() query: GetMessagesQueryDto,
  ): Promise<MessageResponseDto[]> {
    return this.chatService.getChatMessages(id, currentUser.id, query);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send a message in chat' })
  @ApiResponse({
    status: 201,
    description: 'Message sent',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Message must contain text or file',
  })
  @ApiResponse({ status: 403, description: 'Access denied or user blocked' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  async sendMessage(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<MessageResponseDto> {
    return this.chatService.sendMessage(id, currentUser.id, sendMessageDto);
  }

  @Delete('messages/:messageId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a message' })
  @ApiResponse({ status: 200, description: 'Message deleted' })
  @ApiResponse({ status: 403, description: 'Can only delete own messages' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async deleteMessage(
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<{ message: string; messageId: string }> {
    return this.chatService.deleteMessage(messageId, currentUser.id);
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Get unread messages count' })
  @ApiResponse({ status: 200, description: 'Unread counts' })
  async getUnreadCount(
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<{ total: number; chats: Record<string, number> }> {
    return this.chatService.getUnreadCount(currentUser.id);
  }
}
