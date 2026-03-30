import { UserRepository } from '../common/repositories/user.repository';
import { FriendRepository } from '../common/repositories/friend.repository';
import { BlacklistRepository } from '../common/repositories/blacklist.repository';
import { SettingsRepository } from '../common/repositories/settings.repository';
import { UserMapper } from './mappers/user.mapper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { AddToBlacklistDto } from './dto/add-to-blacklist.dto';
import { UserResponseDto } from './dto/user-response.dto/user-response.dto';
import { FriendRequestResponseDto, FriendResponseDto } from './dto/friens-response.dto';
import { BlacklistResponseDto, SettingsResponseDto } from './dto/settings-response.dto';
export declare class UsersService {
    private readonly userRepo;
    private readonly friendRepo;
    private readonly blacklistRepo;
    private readonly settingsRepo;
    private readonly mapper;
    constructor(userRepo: UserRepository, friendRepo: FriendRepository, blacklistRepo: BlacklistRepository, settingsRepo: SettingsRepository, mapper: UserMapper);
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    remove(id: string): Promise<{
        message: string;
        user: UserResponseDto;
    }>;
    sendFriendRequest(currentUserId: string, targetUserId: string): Promise<FriendRequestResponseDto>;
    acceptFriendRequest(currentUserId: string, requestId: string): Promise<FriendResponseDto>;
    rejectFriendRequest(currentUserId: string, requestId: string): Promise<{
        message: string;
    }>;
    removeFriend(currentUserId: string, friendId: string): Promise<{
        message: string;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getSettings(userId: string): Promise<SettingsResponseDto>;
    updateSettings(userId: string, updateSettingsDto: UpdateSettingsDto): Promise<SettingsResponseDto>;
    addToBlackList(currentUserId: string, targetUserId: string, addToBlacklistDto?: AddToBlacklistDto): Promise<BlacklistResponseDto>;
    removeFromBlackList(currentUserId: string, targetUserId: string): Promise<{
        message: string;
    }>;
    getAllFriends(userId: string): Promise<UserResponseDto[]>;
    getIncomingFriendRequests(userId: string): Promise<FriendRequestResponseDto[]>;
    getOutgoingFriendRequests(userId: string): Promise<FriendRequestResponseDto[]>;
    getAllBlackList(userId: string): Promise<BlacklistResponseDto[]>;
    findOne(id: string): Promise<UserResponseDto>;
    findAll(): Promise<UserResponseDto[]>;
    searchUsersByQuery(currentUserId: string, query: string, limit?: number, offset?: number): Promise<{
        users: any[];
        total: number;
        hasMore: boolean;
    }>;
    private ensureUserExists;
}
