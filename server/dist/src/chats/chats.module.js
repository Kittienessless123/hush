"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const chats_controller_1 = require("./chats.controller");
const chats_service_1 = require("./chats.service");
const chat_repository_1 = require("../common/repositories/chat.repository");
const message_repository_1 = require("../common/repositories/message.repository");
const chat_mapper_1 = require("./mapper/chat.mapper");
const prisma_module_1 = require("../prisma/prisma.module");
const user_repository_1 = require("../common/repositories/user.repository");
const blacklist_repository_1 = require("../common/repositories/blacklist.repository");
const common_module_1 = require("../common/common.module");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, common_module_1.CommonModule],
        controllers: [chats_controller_1.ChatController],
        providers: [
            chats_service_1.ChatService,
            chat_repository_1.ChatRepository,
            message_repository_1.MessageRepository,
            chat_mapper_1.ChatMapper,
            user_repository_1.UserRepository,
            blacklist_repository_1.BlacklistRepository,
        ],
        exports: [chats_service_1.ChatService],
    })
], ChatModule);
//# sourceMappingURL=chats.module.js.map