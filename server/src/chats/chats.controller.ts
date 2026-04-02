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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatService } from './chats.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../common/decorators/current-user/current-user.decorator';
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
  ApiConsumes,
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
    @CurrentUser() currentUser: CurrentUserPayload,
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
  async getChatById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
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
  async createChat(
    @Body() createChatDto: CreateChatDto,
    @CurrentUser() currentUser: CurrentUserPayload,
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
  async deleteChat(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
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
  async getChatMessages(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
    @Query() query: GetMessagesQueryDto,
  ): Promise<MessageResponseDto[]> {
    return await this.chatService.getChatMessages(id, currentUser.id, query);
  }

  @Post(':id/messages')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Send a message in chat (text or file)' })
  @ApiResponse({
    status: 201,
    description: 'Message sent',
    type: MessageResponseDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async sendMessage(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
    @Body() sendMessageDto: SendMessageDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<MessageResponseDto> {
    return await this.chatService.sendMessage(
      id,
      currentUser.id,
      sendMessageDto,
      file,
    );
  }

  @Delete('messages/:messageId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a message' })
  @ApiResponse({ status: 200, description: 'Message deleted' })
  async deleteMessage(
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<{ message: string; messageId: string }> {
    return await this.chatService.deleteMessage(messageId, currentUser.id);
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Get unread messages count' })
  @ApiResponse({ status: 200, description: 'Unread counts' })
  async getUnreadCount(
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<{ total: number; chats: Record<string, number> }> {
    return await this.chatService.getUnreadCount(currentUser.id);
  }
}
