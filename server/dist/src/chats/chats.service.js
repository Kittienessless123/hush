"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const chat_repository_1 = require("../common/repositories/chat.repository");
const message_repository_1 = require("../common/repositories/message.repository");
const chat_mapper_1 = require("./mapper/chat.mapper");
const user_repository_1 = require("../common/repositories/user.repository");
const blacklist_repository_1 = require("../common/repositories/blacklist.repository");
let ChatService = class ChatService {
    chatRepo;
    messageRepo;
    userRepo;
    blacklistRepo;
    mapper;
    constructor(chatRepo, messageRepo, userRepo, blacklistRepo, mapper) {
        this.chatRepo = chatRepo;
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
        this.blacklistRepo = blacklistRepo;
        this.mapper = mapper;
    }
    async getUserChats(userId, limit, offset) {
        const [chats, total] = await Promise.all([
            this.chatRepo.findUserChatsWithLastMessage(userId, limit, offset),
            this.chatRepo.countUserChats(userId),
        ]);
        return this.mapper.toChatListResponse(chats, userId, total);
    }
    async getChatById(chatId, userId) {
        const chat = await this.chatRepo.findById(chatId);
        if (!chat) {
            throw new common_1.NotFoundException(`Chat with ID ${chatId} not found`);
        }
        if (chat.user1Id !== userId && chat.user2Id !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this chat');
        }
        const unreadCount = await this.messageRepo.getUnreadCount(chatId, userId);
        const lastMessage = await this.messageRepo.getLastMessage(chatId);
        let lastMessageWithSender;
        if (lastMessage) {
            lastMessageWithSender = await this.messageRepo.findById(lastMessage.id);
        }
        return this.mapper.toChatResponse(chat, userId, lastMessageWithSender, unreadCount);
    }
    async createChat(currentUserId, createChatDto) {
        const { targetUserId } = createChatDto;
        if (currentUserId === targetUserId) {
            throw new common_1.BadRequestException('Cannot create chat with yourself');
        }
        const targetUser = await this.userRepo.findUnique({ id: targetUserId });
        if (!targetUser) {
            throw new common_1.NotFoundException(`User with ID ${targetUserId} not found`);
        }
        const isBlocked = await this.blacklistRepo.checkBlocked(currentUserId, targetUserId);
        if (isBlocked) {
            throw new common_1.ForbiddenException('Cannot create chat with blocked user');
        }
        const existingChat = await this.chatRepo.findChatBetweenUsers(currentUserId, targetUserId);
        if (existingChat) {
            const chatWithUsers = await this.chatRepo.findById(existingChat.id);
            return this.mapper.toChatResponse(chatWithUsers, currentUserId);
        }
        const chat = await this.chatRepo.create(currentUserId, targetUserId);
        return this.mapper.toChatResponse(chat, currentUserId);
    }
    async deleteChat(chatId, userId) {
        const chat = await this.chatRepo.findById(chatId);
        if (!chat) {
            throw new common_1.NotFoundException(`Chat with ID ${chatId} not found`);
        }
        if (chat.user1Id !== userId && chat.user2Id !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to delete this chat');
        }
        await this.messageRepo.deleteChatMessages(chatId);
        await this.chatRepo.delete(chatId);
        return {
            message: 'Chat deleted successfully',
            chatId,
        };
    }
    async getChatMessages(chatId, userId, query) {
        const { limit = 50, offset = 0, before } = query;
        const chat = await this.chatRepo.findById(chatId);
        if (!chat) {
            throw new common_1.NotFoundException(`Chat with ID ${chatId} not found`);
        }
        if (chat.user1Id !== userId && chat.user2Id !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this chat');
        }
        const messages = await this.messageRepo.findMessagesByChatId(chatId, {
            limit,
            offset,
            before,
        });
        return messages.map((msg) => this.mapper.toMessageResponse(msg));
    }
    async sendMessage(chatId, userId, sendMessageDto) {
        const { text, fileUrl, fileType, encrypted = true } = sendMessageDto;
        if (!text && !fileUrl) {
            throw new common_1.BadRequestException('Message must contain either text or file');
        }
        const chat = await this.chatRepo.findById(chatId);
        if (!chat) {
            throw new common_1.NotFoundException(`Chat with ID ${chatId} not found`);
        }
        if (chat.user1Id !== userId && chat.user2Id !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this chat');
        }
        const otherUserId = chat.user1Id === userId ? chat.user2Id : chat.user1Id;
        const isBlocked = await this.blacklistRepo.checkBlocked(userId, otherUserId);
        if (isBlocked) {
            throw new common_1.ForbiddenException('Cannot send message to blocked user');
        }
        const message = await this.messageRepo.create(chatId, userId, {
            text,
            fileUrl,
            fileType,
            encrypted,
        });
        await this.chatRepo.updateChatTimestamp(chatId);
        return this.mapper.toMessageResponse(message);
    }
    async deleteMessage(messageId, userId) {
        const message = await this.messageRepo.findById(messageId);
        if (!message) {
            throw new common_1.NotFoundException(`Message with ID ${messageId} not found`);
        }
        if (message.senderId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own messages');
        }
        await this.messageRepo.delete(messageId);
        return {
            message: 'Message deleted successfully',
            messageId,
        };
    }
    async getUnreadCount(userId) {
        const chats = await this.chatRepo.findUserChats(userId);
        const unreadCounts = {};
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
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_repository_1.ChatRepository,
        message_repository_1.MessageRepository,
        user_repository_1.UserRepository,
        blacklist_repository_1.BlacklistRepository,
        chat_mapper_1.ChatMapper])
], ChatService);
//# sourceMappingURL=chats.service.js.map