import { ChatRepository } from '../common/repositories/chat.repository';
import { MessageRepository } from '../common/repositories/message.repository';
import { ChatMapper } from './mapper/chat.mapper';
import { UserRepository } from '../common/repositories/user.repository';
import { BlacklistRepository } from '../common/repositories/blacklist.repository';
import { CreateChatDto, SendMessageDto, GetMessagesQueryDto } from './dto/chat.dto';
import { ChatResponseDto, MessageResponseDto, ChatListResponseDto, DeleteChatResponseDto } from './dto/chat.dto';
export declare class ChatService {
    private readonly chatRepo;
    private readonly messageRepo;
    private readonly userRepo;
    private readonly blacklistRepo;
    private readonly mapper;
    constructor(chatRepo: ChatRepository, messageRepo: MessageRepository, userRepo: UserRepository, blacklistRepo: BlacklistRepository, mapper: ChatMapper);
    getUserChats(userId: string, limit?: number, offset?: number): Promise<ChatListResponseDto>;
    getChatById(chatId: string, userId: string): Promise<ChatResponseDto>;
    createChat(currentUserId: string, createChatDto: CreateChatDto): Promise<ChatResponseDto>;
    deleteChat(chatId: string, userId: string): Promise<DeleteChatResponseDto>;
    getChatMessages(chatId: string, userId: string, query: GetMessagesQueryDto): Promise<MessageResponseDto[]>;
    sendMessage(chatId: string, userId: string, sendMessageDto: SendMessageDto): Promise<MessageResponseDto>;
    deleteMessage(messageId: string, userId: string): Promise<{
        message: string;
        messageId: string;
    }>;
    getUnreadCount(userId: string): Promise<{
        total: number;
        chats: Record<string, number>;
    }>;
}
