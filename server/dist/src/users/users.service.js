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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const user_repository_1 = require("../common/repositories/user.repository");
const friend_repository_1 = require("../common/repositories/friend.repository");
const blacklist_repository_1 = require("../common/repositories/blacklist.repository");
const settings_repository_1 = require("../common/repositories/settings.repository");
const user_mapper_1 = require("./mappers/user.mapper");
let UsersService = class UsersService {
    userRepo;
    friendRepo;
    blacklistRepo;
    settingsRepo;
    mapper;
    constructor(userRepo, friendRepo, blacklistRepo, settingsRepo, mapper) {
        this.userRepo = userRepo;
        this.friendRepo = friendRepo;
        this.blacklistRepo = blacklistRepo;
        this.settingsRepo = settingsRepo;
        this.mapper = mapper;
    }
    async create(createUserDto) {
        const { isUnique, conflictField } = await this.userRepo.checkUnique({
            login: createUserDto.login,
            username: createUserDto.username,
            email: createUserDto.email,
        });
        if (!isUnique) {
            throw new common_1.ConflictException(`User with this ${conflictField} already exists`);
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.userRepo.create({
            username: createUserDto.username,
            login: createUserDto.login,
            passwordHash: hashedPassword,
            email: createUserDto.email,
            publicKey: createUserDto.publicKey,
        });
        return this.mapper.toUserResponse(user);
    }
    async update(id, updateUserDto) {
        await this.ensureUserExists(id);
        if (updateUserDto.username || updateUserDto.email) {
            const { isUnique, conflictField } = await this.userRepo.checkUnique({
                username: updateUserDto.username,
                email: updateUserDto.email,
            }, id);
            if (!isUnique) {
                throw new common_1.ConflictException(`${conflictField} already taken`);
            }
        }
        const user = await this.userRepo.update({ id }, {
            username: updateUserDto.username,
            email: updateUserDto.email,
            avatar: updateUserDto.avatar,
            publicKey: updateUserDto.publicKey,
            description: updateUserDto.description,
        });
        return this.mapper.toUserResponse(user);
    }
    async remove(id) {
        const user = await this.userRepo.delete({ id });
        return {
            message: 'User deleted successfully',
            user: this.mapper.toUserResponse(user),
        };
    }
    async sendFriendRequest(currentUserId, targetUserId) {
        if (currentUserId === targetUserId) {
            throw new common_1.BadRequestException('Cannot send friend request to yourself');
        }
        await this.ensureUserExists(targetUserId);
        const isBlocked = await this.blacklistRepo.checkBlocked(currentUserId, targetUserId);
        if (isBlocked) {
            throw new common_1.ConflictException('Cannot send friend request to a blocked user');
        }
        const existingFriendship = await this.friendRepo.findFriendship(currentUserId, targetUserId);
        if (existingFriendship) {
            if (existingFriendship.status === 'accepted') {
                throw new common_1.ConflictException('User is already your friend');
            }
            if (existingFriendship.status === 'pending') {
                const message = existingFriendship.userId === currentUserId
                    ? 'Friend request already sent'
                    : 'User has already sent you a friend request';
                throw new common_1.ConflictException(message);
            }
        }
        const request = await this.friendRepo.create({
            user: { connect: { id: currentUserId } },
            friend: { connect: { id: targetUserId } },
            status: 'pending',
        });
        const requestWithDetails = await this.friendRepo.findRequestById(request.id);
        if (!requestWithDetails) {
            throw new common_1.NotFoundException('Failed to create friend request');
        }
        return this.mapper.toFriendRequestResponse(requestWithDetails);
    }
    async acceptFriendRequest(currentUserId, requestId) {
        const request = await this.friendRepo.findRequestById(requestId);
        if (!request) {
            throw new common_1.NotFoundException(`Friend request with ID ${requestId} not found`);
        }
        if (request.friend.id !== currentUserId) {
            throw new common_1.BadRequestException('You cannot accept this friend request');
        }
        if (request.status !== 'pending') {
            throw new common_1.ConflictException(`Friend request is already ${request.status}`);
        }
        const acceptedRequest = await this.friendRepo.update({ id: requestId }, { status: 'accepted' });
        const updatedRequest = await this.friendRepo.findRequestById(acceptedRequest.id);
        if (!updatedRequest) {
            throw new common_1.NotFoundException('Failed to update friend request');
        }
        return this.mapper.toFriendResponse(updatedRequest);
    }
    async rejectFriendRequest(currentUserId, requestId) {
        const request = await this.friendRepo.findRequestById(requestId);
        if (!request) {
            throw new common_1.NotFoundException(`Friend request with ID ${requestId} not found`);
        }
        if (request.friend.id !== currentUserId) {
            throw new common_1.BadRequestException('You cannot reject this friend request');
        }
        if (request.status !== 'pending') {
            throw new common_1.ConflictException(`Friend request is already ${request.status}`);
        }
        await this.friendRepo.delete({ id: requestId });
        return { message: 'Friend request rejected successfully' };
    }
    async removeFriend(currentUserId, friendId) {
        const friendship = await this.friendRepo.findFriendship(currentUserId, friendId);
        if (!friendship || friendship.status !== 'accepted') {
            throw new common_1.NotFoundException('Friendship not found');
        }
        await this.friendRepo.delete({ id: friendship.id });
        return { message: 'Friend removed successfully' };
    }
    async changePassword(userId, changePasswordDto) {
        const user = await this.userRepo.findUnique({ id: userId });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const isSamePassword = await bcrypt.compare(changePasswordDto.newPassword, user.passwordHash);
        if (isSamePassword) {
            throw new common_1.BadRequestException('New password must be different from current password');
        }
        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        await this.userRepo.update({ id: userId }, { passwordHash: hashedPassword });
        return { message: 'Password changed successfully' };
    }
    async getSettings(userId) {
        const settings = await this.settingsRepo.findByUserId(userId);
        if (!settings) {
            throw new common_1.NotFoundException('Settings not found');
        }
        return this.mapper.toSettingsResponse(settings);
    }
    async updateSettings(userId, updateSettingsDto) {
        const settings = await this.settingsRepo.findByUserId(userId);
        if (!settings) {
            throw new common_1.NotFoundException('Settings not found');
        }
        const updatedSettings = await this.settingsRepo.update({ userId }, {
            theme: updateSettingsDto.theme,
            language: updateSettingsDto.language,
            notifications: updateSettingsDto.notifications,
            privacy: updateSettingsDto.privacy,
            twoFactorAuth: updateSettingsDto.twoFactorAuth,
        });
        return this.mapper.toSettingsResponse(updatedSettings);
    }
    async addToBlackList(currentUserId, targetUserId, addToBlacklistDto) {
        if (currentUserId === targetUserId) {
            throw new common_1.BadRequestException('Cannot block yourself');
        }
        await this.ensureUserExists(targetUserId);
        const existingBlock = await this.blacklistRepo.findBlock(currentUserId, targetUserId);
        if (existingBlock) {
            throw new common_1.ConflictException('User is already in blacklist');
        }
        const friendship = await this.friendRepo.findFriendship(currentUserId, targetUserId);
        if (friendship) {
            await this.friendRepo.delete({ id: friendship.id });
        }
        const blacklistEntry = await this.blacklistRepo.create({
            blocker: { connect: { id: currentUserId } },
            blocked: { connect: { id: targetUserId } },
            reason: addToBlacklistDto?.reason,
        });
        const blacklistWithUser = await this.blacklistRepo.getUserBlacklist(currentUserId);
        const entry = blacklistWithUser.find((b) => b.id === blacklistEntry.id);
        if (!entry) {
            throw new common_1.NotFoundException('Failed to create blacklist entry');
        }
        return this.mapper.toBlacklistResponse(entry);
    }
    async removeFromBlackList(currentUserId, targetUserId) {
        const blacklistEntry = await this.blacklistRepo.findBlock(currentUserId, targetUserId);
        if (!blacklistEntry) {
            throw new common_1.NotFoundException('User not found in blacklist');
        }
        await this.blacklistRepo.delete({
            blockerId_blockedId: {
                blockerId: currentUserId,
                blockedId: targetUserId,
            },
        });
        return { message: 'User removed from blacklist successfully' };
    }
    async getAllFriends(userId) {
        const friendships = await this.friendRepo.getUserFriends(userId, 'accepted');
        return friendships.map((friendship) => {
            const friendData = friendship.user.id === userId ? friendship.friend : friendship.user;
            return this.mapper.toUserResponse({
                ...friendData,
                settings: null,
            });
        });
    }
    async getIncomingFriendRequests(userId) {
        const requests = await this.friendRepo.getUserRequests(userId, 'incoming');
        return requests.map((req) => this.mapper.toFriendRequestResponse(req));
    }
    async getOutgoingFriendRequests(userId) {
        const requests = await this.friendRepo.getUserRequests(userId, 'outgoing');
        return requests.map((req) => this.mapper.toFriendRequestResponse(req));
    }
    async getAllBlackList(userId) {
        const blacklist = await this.blacklistRepo.getUserBlacklist(userId);
        return blacklist.map((entry) => this.mapper.toBlacklistResponse(entry));
    }
    async findOne(id) {
        const user = await this.userRepo.findUnique({ id });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return this.mapper.toUserResponse(user);
    }
    async findAll() {
        const users = await this.userRepo.findMany();
        return users.map((user) => this.mapper.toUserResponse(user));
    }
    async searchUsersByQuery(currentUserId, query, limit = 20, offset = 0) {
        if (!query || query.trim().length < 2) {
            return { users: [], total: 0, hasMore: false };
        }
        const [users, total] = await Promise.all([
            this.userRepo.findMany({
                where: {
                    AND: [
                        {
                            OR: [
                                { username: { contains: query, mode: 'insensitive' } },
                                { login: { contains: query, mode: 'insensitive' } },
                                { email: { contains: query, mode: 'insensitive' } },
                            ],
                        },
                        { NOT: { id: currentUserId } },
                    ],
                },
                skip: offset,
                take: limit,
                orderBy: { username: 'asc' },
            }),
            this.userRepo.count({
                AND: [
                    {
                        OR: [
                            { username: { contains: query, mode: 'insensitive' } },
                            { login: { contains: query, mode: 'insensitive' } },
                            { email: { contains: query, mode: 'insensitive' } },
                        ],
                    },
                    { NOT: { id: currentUserId } },
                ],
            }),
        ]);
        const usersWithStatus = await Promise.all(users.map(async (user) => {
            const friendship = await this.friendRepo.findFriendship(currentUserId, user.id);
            const isBlocked = await this.blacklistRepo.checkBlocked(currentUserId, user.id);
            const isBlockedByMe = await this.blacklistRepo.findBlock(currentUserId, user.id);
            return {
                ...this.mapper.toUserResponse(user),
                friendshipStatus: friendship?.status || null,
                isBlocked: !!isBlocked,
                isBlockedByMe: !!isBlockedByMe,
            };
        }));
        return {
            users: usersWithStatus,
            total,
            hasMore: offset + limit < total,
        };
    }
    async ensureUserExists(id) {
        const exists = await this.userRepo.exists({ id });
        if (!exists) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        friend_repository_1.FriendRepository,
        blacklist_repository_1.BlacklistRepository,
        settings_repository_1.SettingsRepository,
        user_mapper_1.UserMapper])
], UsersService);
//# sourceMappingURL=users.service.js.map