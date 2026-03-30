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
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import * as currentUserDecorator from '../common/decorators/current-user/current-user.decorator';
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
    @currentUserDecorator.CurrentUser()
    currentUser: currentUserDecorator.CurrentUserPayload,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<ChatListResponseDto> {
    return await this.chatService.getUserChats(
      currentUser.id,
      limit ? parseInt(limit, 10) : undefined,
      offset ? parseInt(offset, 10) : undefined,
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
    @currentUserDecorator.CurrentUser()
    currentUser: currentUserDecorator.CurrentUserPayload,
  ): Promise<ChatResponseDto> {
    return await this.chatService.getChatById(id, currentUser.id);
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
    @currentUserDecorator.CurrentUser()
    currentUser: currentUserDecorator.CurrentUserPayload,
  ): Promise<ChatResponseDto> {
    return await this.chatService.createChat(currentUser.id, createChatDto);
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
    @currentUserDecorator.CurrentUser()
    currentUser: currentUserDecorator.CurrentUserPayload,
  ): Promise<DeleteChatResponseDto> {
    return await this.chatService.deleteChat(id, currentUser.id);
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
    @currentUserDecorator.CurrentUser()
    currentUser: currentUserDecorator.CurrentUserPayload,
    @Query() query: GetMessagesQueryDto,
  ): Promise<MessageResponseDto[]> {
    return await this.chatService.getChatMessages(id, currentUser.id, query);
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
    @currentUserDecorator.CurrentUser()
    currentUser: currentUserDecorator.CurrentUserPayload,
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<MessageResponseDto> {
    return await this.chatService.sendMessage(
      id,
      currentUser.id,
      sendMessageDto,
    );
  }

  @Delete('messages/:messageId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a message' })
  @ApiResponse({ status: 200, description: 'Message deleted' })
  @ApiResponse({ status: 403, description: 'Can only delete own messages' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  deleteMessage(
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @currentUserDecorator.CurrentUser()
    currentUser: currentUserDecorator.CurrentUserPayload,
  ): Promise<{ message: string; messageId: string }> {
    return this.chatService.deleteMessage(messageId, currentUser.id);
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Get unread messages count' })
  @ApiResponse({ status: 200, description: 'Unread counts' })
  async getUnreadCount(
    @currentUserDecorator.CurrentUser()
    currentUser: currentUserDecorator.CurrentUserPayload,
  ): Promise<{ total: number; chats: Record<string, number> }> {
    return await this.chatService.getUnreadCount(currentUser.id);
  }
}
