"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chats_service_1 = require("./chats.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth/jwt-auth.guard");
const currentUserDecorator = __importStar(require("../common/decorators/current-user/current-user.decorator"));
const chat_dto_1 = require("./dto/chat.dto");
const chat_dto_2 = require("./dto/chat.dto");
const swagger_1 = require("@nestjs/swagger");
let ChatController = class ChatController {
    chatService;
    constructor(chatService) {
        this.chatService = chatService;
    }
    async getUserChats(currentUser, limit, offset) {
        return await this.chatService.getUserChats(currentUser.id, limit ? parseInt(limit, 10) : undefined, offset ? parseInt(offset, 10) : undefined);
    }
    async getChatById(id, currentUser) {
        return await this.chatService.getChatById(id, currentUser.id);
    }
    async createChat(createChatDto, currentUser) {
        return await this.chatService.createChat(currentUser.id, createChatDto);
    }
    async deleteChat(id, currentUser) {
        return await this.chatService.deleteChat(id, currentUser.id);
    }
    async getChatMessages(id, currentUser, query) {
        return await this.chatService.getChatMessages(id, currentUser.id, query);
    }
    async sendMessage(id, currentUser, sendMessageDto) {
        return await this.chatService.sendMessage(id, currentUser.id, sendMessageDto);
    }
    deleteMessage(messageId, currentUser) {
        return this.chatService.deleteMessage(messageId, currentUser.id);
    }
    async getUnreadCount(currentUser) {
        return await this.chatService.getUnreadCount(currentUser.id);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all chats for current user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of chats',
        type: chat_dto_2.ChatListResponseDto,
    }),
    __param(0, currentUserDecorator.CurrentUser()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getUserChats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chat by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chat details',
        type: chat_dto_2.ChatResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, currentUserDecorator.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new chat' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Chat created',
        type: chat_dto_2.ChatResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot create chat with yourself' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Cannot create chat with blocked user',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Target user not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, currentUserDecorator.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.CreateChatDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createChat", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a chat' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chat deleted',
        type: chat_dto_2.DeleteChatResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Permission denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, currentUserDecorator.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteChat", null);
__decorate([
    (0, common_1.Get)(':id/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Get messages in chat' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of messages',
        type: [chat_dto_2.MessageResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, currentUserDecorator.CurrentUser()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, chat_dto_1.GetMessagesQueryDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatMessages", null);
__decorate([
    (0, common_1.Post)(':id/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message in chat' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Message sent',
        type: chat_dto_2.MessageResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Message must contain text or file',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied or user blocked' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, currentUserDecorator.CurrentUser()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, chat_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Delete)('messages/:messageId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a message' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message deleted' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Can only delete own messages' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Message not found' }),
    __param(0, (0, common_1.Param)('messageId', common_1.ParseUUIDPipe)),
    __param(1, currentUserDecorator.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteMessage", null);
__decorate([
    (0, common_1.Get)('unread/count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread messages count' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unread counts' }),
    __param(0, currentUserDecorator.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getUnreadCount", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('Chats'),
    (0, common_1.Controller)('chats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [chats_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chats.controller.js.map