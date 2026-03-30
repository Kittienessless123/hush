import { UsersService } from './users.service';
import * as currentUserDecorator from '../common/decorators/current-user/current-user.decorator';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto, AddToBlacklistDto, UpdateSettingsDto, SearchUsersQueryDto, CreateFriendRequestDto } from './dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./dto").UserResponseDto>;
    findAll(): Promise<import("./dto").UserResponseDto[]>;
    findOne(id: string): Promise<import("./dto").UserResponseDto>;
    update(currentUser: currentUserDecorator.CurrentUserPayload, updateUserDto: UpdateUserDto): Promise<import("./dto").UserResponseDto>;
    remove(userId: string): Promise<{
        message: string;
        user: import("./dto").UserResponseDto;
    }>;
    getAllFriends(userId: string): Promise<import("./dto").UserResponseDto[]>;
    sendFriendRequest(createRequestDto: CreateFriendRequestDto, currentUserId: string): Promise<import("./dto/friens-response.dto").FriendRequestResponseDto>;
    acceptFriendRequest(requestId: string, currentUserId: string): Promise<import("./dto/friens-response.dto").FriendResponseDto>;
    rejectFriendRequest(requestId: string, currentUserId: string): Promise<{
        message: string;
    }>;
    removeFriend(friendId: string, currentUserId: string): Promise<{
        message: string;
    }>;
    getIncomingRequests(userId: string): Promise<import("./dto/friens-response.dto").FriendRequestResponseDto[]>;
    getOutgoingRequests(userId: string): Promise<import("./dto/friens-response.dto").FriendRequestResponseDto[]>;
    getSettings(userId: string): Promise<import("./dto/settings-response.dto").SettingsResponseDto>;
    updateSettings(updateSettingsDto: UpdateSettingsDto, userId: string): Promise<import("./dto/settings-response.dto").SettingsResponseDto>;
    changePassword(changePasswordDto: ChangePasswordDto, userId: string): Promise<{
        message: string;
    }>;
    getAllBlackList(userId: string): Promise<import("./dto/settings-response.dto").BlacklistResponseDto[]>;
    addToBlackList(addToBlacklistDto: AddToBlacklistDto, currentUserId: string): Promise<import("./dto/settings-response.dto").BlacklistResponseDto>;
    removeFromBlackList(userId: string, currentUserId: string): Promise<{
        message: string;
    }>;
    searchUsersByQuery(currentUserId: string, searchQuery: SearchUsersQueryDto): Promise<{
        users: any[];
        total: number;
        hasMore: boolean;
    }>;
}
