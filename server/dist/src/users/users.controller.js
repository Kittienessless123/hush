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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth/jwt-auth.guard");
const currentUserDecorator = __importStar(require("../common/decorators/current-user/current-user.decorator"));
const public_decorator_1 = require("../common/decorators/public.decorator");
const dto_1 = require("./dto");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async create(createUserDto) {
        return await this.usersService.create(createUserDto);
    }
    async findAll() {
        return await this.usersService.findAll();
    }
    async findOne(id) {
        return await this.usersService.findOne(id);
    }
    async update(currentUser, updateUserDto) {
        return await this.usersService.update(currentUser.id, updateUserDto);
    }
    async remove(userId) {
        return await this.usersService.remove(userId);
    }
    async getAllFriends(userId) {
        return await this.usersService.getAllFriends(userId);
    }
    async sendFriendRequest(createRequestDto, currentUserId) {
        return await this.usersService.sendFriendRequest(currentUserId, createRequestDto.targetUserId);
    }
    async acceptFriendRequest(requestId, currentUserId) {
        return await this.usersService.acceptFriendRequest(currentUserId, requestId);
    }
    async rejectFriendRequest(requestId, currentUserId) {
        return await this.usersService.rejectFriendRequest(currentUserId, requestId);
    }
    async removeFriend(friendId, currentUserId) {
        return await this.usersService.removeFriend(currentUserId, friendId);
    }
    async getIncomingRequests(userId) {
        return await this.usersService.getIncomingFriendRequests(userId);
    }
    async getOutgoingRequests(userId) {
        return await this.usersService.getOutgoingFriendRequests(userId);
    }
    async getSettings(userId) {
        return await this.usersService.getSettings(userId);
    }
    async updateSettings(updateSettingsDto, userId) {
        return await this.usersService.updateSettings(userId, updateSettingsDto);
    }
    async changePassword(changePasswordDto, userId) {
        return await this.usersService.changePassword(userId, changePasswordDto);
    }
    async getAllBlackList(userId) {
        return await this.usersService.getAllBlackList(userId);
    }
    async addToBlackList(addToBlacklistDto, currentUserId) {
        return await this.usersService.addToBlackList(currentUserId, addToBlacklistDto.userId, addToBlacklistDto);
    }
    async removeFromBlackList(userId, currentUserId) {
        return await this.usersService.removeFromBlackList(currentUserId, userId);
    }
    async searchUsersByQuery(currentUserId, searchQuery) {
        return await this.usersService.searchUsersByQuery(currentUserId, searchQuery.query || '', searchQuery.limit, searchQuery.offset);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('profile/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('profile'),
    __param(0, currentUserDecorator.CurrentUser()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('profile'),
    __param(0, currentUserDecorator.CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('friends'),
    __param(0, currentUserDecorator.CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllFriends", null);
__decorate([
    (0, common_1.Post)('friends/requests'),
    __param(0, (0, common_1.Body)()),
    __param(1, currentUserDecorator.CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateFriendRequestDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "sendFriendRequest", null);
__decorate([
    (0, common_1.Patch)('friends/requests/:requestId/accept'),
    __param(0, (0, common_1.Param)('requestId', common_1.ParseUUIDPipe)),
    __param(1, currentUserDecorator.CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "acceptFriendRequest", null);
__decorate([
    (0, common_1.Delete)('friends/requests/:requestId/reject'),
    __param(0, (0, common_1.Param)('requestId', common_1.ParseUUIDPipe)),
    __param(1, currentUserDecorator.CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "rejectFriendRequest", null);
__decorate([
    (0, common_1.Delete)('friends/:friendId'),
    __param(0, (0, common_1.Param)('friendId', common_1.ParseUUIDPipe)),
    __param(1, currentUserDecorator.CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeFriend", null);
__decorate([
    (0, common_1.Get)('friends/requests/incoming'),
    __param(0, currentUserDecorator.CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getIncomingRequests", null);
__decorate([
    (0, common_1.Get)('friends/requests/outgoing'),
    __param(0, currentUserDecorator.CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getOutgoingRequests", null);
__decorate([
    (0, common_1.Get)('settings'),
    __param(0, currentUserDecorator.CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Patch)('settings'),
    __param(0, (0, common_1.Body)()),
    __param(1, currentUserDecorator.CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.UpdateSettingsDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Patch)('settings/password'),
    __param(0, (0, common_1.Body)()),
    __param(1, currentUserDecorator.CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ChangePasswordDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('blacklist'),
    __param(0, currentUserDecorator.CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllBlackList", null);
__decorate([
    (0, common_1.Post)('blacklist'),
    __param(0, (0, common_1.Body)()),
    __param(1, currentUserDecorator.CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AddToBlacklistDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addToBlackList", null);
__decorate([
    (0, common_1.Delete)('blacklist/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, currentUserDecorator.CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeFromBlackList", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, currentUserDecorator.CurrentUser('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.SearchUsersQueryDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "searchUsersByQuery", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map