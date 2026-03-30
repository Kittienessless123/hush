import { ChatService } from './chats.service';
import * as currentUserDecorator from '../common/decorators/current-user/current-user.decorator';
import { CreateChatDto, SendMessageDto, GetMessagesQueryDto } from './dto/chat.dto';
import { ChatResponseDto, MessageResponseDto, ChatListResponseDto, DeleteChatResponseDto } from './dto/chat.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getUserChats(currentUser: currentUserDecorator.CurrentUserPayload, limit?: string, offset?: string): Promise<ChatListResponseDto>;
    getChatById(id: string, currentUser: currentUserDecorator.CurrentUserPayload): Promise<ChatResponseDto>;
    createChat(createChatDto: CreateChatDto, currentUser: currentUserDecorator.CurrentUserPayload): Promise<ChatResponseDto>;
    deleteChat(id: string, currentUser: currentUserDecorator.CurrentUserPayload): Promise<DeleteChatResponseDto>;
    getChatMessages(id: string, currentUser: currentUserDecorator.CurrentUserPayload, query: GetMessagesQueryDto): Promise<MessageResponseDto[]>;
    sendMessage(id: string, currentUser: currentUserDecorator.CurrentUserPayload, sendMessageDto: SendMessageDto): Promise<MessageResponseDto>;
    deleteMessage(messageId: string, currentUser: currentUserDecorator.CurrentUserPayload): Promise<{
        message: string;
        messageId: string;
    }>;
    getUnreadCount(currentUser: currentUserDecorator.CurrentUserPayload): Promise<{
        total: number;
        chats: Record<string, number>;
    }>;
}
