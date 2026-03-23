// src/users/users.service.ts
import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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
import {
  FriendRequestResponseDto,
  FriendResponseDto,
} from './dto/friens-response.dto';
import {
  BlacklistResponseDto,
  SettingsResponseDto,
} from './dto/settings-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly friendRepo: FriendRepository,
    private readonly blacklistRepo: BlacklistRepository,
    private readonly settingsRepo: SettingsRepository,
    private readonly mapper: UserMapper,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { isUnique, conflictField } = await this.userRepo.checkUnique({
      login: createUserDto.login,
      username: createUserDto.username,
      email: createUserDto.email,
    });

    if (!isUnique) {
      throw new ConflictException(
        `User with this ${conflictField} already exists`,
      );
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

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    await this.ensureUserExists(id);

    if (updateUserDto.username || updateUserDto.email) {
      const { isUnique, conflictField } = await this.userRepo.checkUnique(
        {
          username: updateUserDto.username,
          email: updateUserDto.email,
        },
        id,
      );

      if (!isUnique) {
        throw new ConflictException(`${conflictField} already taken`);
      }
    }

    const user = await this.userRepo.update(
      { id },
      {
        username: updateUserDto.username,
        email: updateUserDto.email,
        avatar: updateUserDto.avatar,
        publicKey: updateUserDto.publicKey,
        description: updateUserDto.description,
      },
    );

    return this.mapper.toUserResponse(user);
  }

  async remove(
    id: string,
  ): Promise<{ message: string; user: UserResponseDto }> {
    const user = await this.userRepo.delete({ id });
    return {
      message: 'User deleted successfully',
      user: this.mapper.toUserResponse(user),
    };
  }

  async sendFriendRequest(
    currentUserId: string,
    targetUserId: string,
  ): Promise<FriendRequestResponseDto> {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('Cannot send friend request to yourself');
    }

    await this.ensureUserExists(targetUserId);

    const isBlocked = await this.blacklistRepo.checkBlocked(
      currentUserId,
      targetUserId,
    );
    if (isBlocked) {
      throw new ConflictException(
        'Cannot send friend request to a blocked user',
      );
    }

    const existingFriendship = await this.friendRepo.findFriendship(
      currentUserId,
      targetUserId,
    );
    if (existingFriendship) {
      if (existingFriendship.status === 'accepted') {
        throw new ConflictException('User is already your friend');
      }
      if (existingFriendship.status === 'pending') {
        const message =
          existingFriendship.userId === currentUserId
            ? 'Friend request already sent'
            : 'User has already sent you a friend request';
        throw new ConflictException(message);
      }
    }

    const request = await this.friendRepo.create({
      user: { connect: { id: currentUserId } },
      friend: { connect: { id: targetUserId } },
      status: 'pending',
    });

    const requestWithDetails = await this.friendRepo.findRequestById(
      request.id,
    );
    if (!requestWithDetails) {
      throw new NotFoundException('Failed to create friend request');
    }

    return this.mapper.toFriendRequestResponse(requestWithDetails);
  }

  async acceptFriendRequest(
    currentUserId: string,
    requestId: string,
  ): Promise<FriendResponseDto> {
    const request = await this.friendRepo.findRequestById(requestId);
    if (!request) {
      throw new NotFoundException(
        `Friend request with ID ${requestId} not found`,
      );
    }

    if (request.friend.id !== currentUserId) {
      throw new BadRequestException('You cannot accept this friend request');
    }

    if (request.status !== 'pending') {
      throw new ConflictException(
        `Friend request is already ${request.status}`,
      );
    }

    const acceptedRequest = await this.friendRepo.update(
      { id: requestId },
      { status: 'accepted' },
    );

    const updatedRequest = await this.friendRepo.findRequestById(
      acceptedRequest.id,
    );
    if (!updatedRequest) {
      throw new NotFoundException('Failed to update friend request');
    }

    return this.mapper.toFriendResponse(updatedRequest);
  }

  async rejectFriendRequest(
    currentUserId: string,
    requestId: string,
  ): Promise<{ message: string }> {
    const request = await this.friendRepo.findRequestById(requestId);
    if (!request) {
      throw new NotFoundException(
        `Friend request with ID ${requestId} not found`,
      );
    }

    if (request.friend.id !== currentUserId) {
      throw new BadRequestException('You cannot reject this friend request');
    }

    if (request.status !== 'pending') {
      throw new ConflictException(
        `Friend request is already ${request.status}`,
      );
    }

    await this.friendRepo.delete({ id: requestId });
    return { message: 'Friend request rejected successfully' };
  }

  async removeFriend(
    currentUserId: string,
    friendId: string,
  ): Promise<{ message: string }> {
    const friendship = await this.friendRepo.findFriendship(
      currentUserId,
      friendId,
    );

    if (!friendship || friendship.status !== 'accepted') {
      throw new NotFoundException('Friendship not found');
    }

    await this.friendRepo.delete({ id: friendship.id });
    return { message: 'Friend removed successfully' };
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepo.findUnique({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const isSamePassword = await bcrypt.compare(
      changePasswordDto.newPassword,
      user.passwordHash,
    );
    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.userRepo.update(
      { id: userId },
      { passwordHash: hashedPassword },
    );

    return { message: 'Password changed successfully' };
  }

  async getSettings(userId: string): Promise<SettingsResponseDto> {
    const settings = await this.settingsRepo.findByUserId(userId);
    if (!settings) {
      throw new NotFoundException('Settings not found');
    }
    return this.mapper.toSettingsResponse(settings);
  }

  async updateSettings(
    userId: string,
    updateSettingsDto: UpdateSettingsDto,
  ): Promise<SettingsResponseDto> {
    const settings = await this.settingsRepo.findByUserId(userId);
    if (!settings) {
      throw new NotFoundException('Settings not found');
    }

    const updatedSettings = await this.settingsRepo.update(
      { userId },
      {
        theme: updateSettingsDto.theme,
        language: updateSettingsDto.language,
        notifications: updateSettingsDto.notifications,
        privacy: updateSettingsDto.privacy,
        twoFactorAuth: updateSettingsDto.twoFactorAuth,
      },
    );

    return this.mapper.toSettingsResponse(updatedSettings);
  }

  async addToBlackList(
    currentUserId: string,
    targetUserId: string,
    addToBlacklistDto?: AddToBlacklistDto,
  ): Promise<BlacklistResponseDto> {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('Cannot block yourself');
    }

    await this.ensureUserExists(targetUserId);

    const existingBlock = await this.blacklistRepo.findBlock(
      currentUserId,
      targetUserId,
    );
    if (existingBlock) {
      throw new ConflictException('User is already in blacklist');
    }

    // Remove any existing friendship
    const friendship = await this.friendRepo.findFriendship(
      currentUserId,
      targetUserId,
    );
    if (friendship) {
      await this.friendRepo.delete({ id: friendship.id });
    }

    const blacklistEntry = await this.blacklistRepo.create({
      blocker: { connect: { id: currentUserId } },
      blocked: { connect: { id: targetUserId } },
      reason: addToBlacklistDto?.reason,
    });

    const blacklistWithUser =
      await this.blacklistRepo.getUserBlacklist(currentUserId);
    const entry = blacklistWithUser.find((b) => b.id === blacklistEntry.id);

    if (!entry) {
      throw new NotFoundException('Failed to create blacklist entry');
    }

    return this.mapper.toBlacklistResponse(entry);
  }

  async removeFromBlackList(
    currentUserId: string,
    targetUserId: string,
  ): Promise<{ message: string }> {
    const blacklistEntry = await this.blacklistRepo.findBlock(
      currentUserId,
      targetUserId,
    );
    if (!blacklistEntry) {
      throw new NotFoundException('User not found in blacklist');
    }

    await this.blacklistRepo.delete({
      blockerId_blockedId: {
        blockerId: currentUserId,
        blockedId: targetUserId,
      },
    });
    return { message: 'User removed from blacklist successfully' };
  }

  async getAllFriends(userId: string): Promise<UserResponseDto[]> {
    const friendships = await this.friendRepo.getUserFriends(
      userId,
      'accepted',
    );

    return friendships.map((friendship) => {
      const friendData =
        friendship.user.id === userId ? friendship.friend : friendship.user;
      return this.mapper.toUserResponse({
        ...friendData,
        settings: null,
      } as any);
    });
  }

  async getIncomingFriendRequests(
    userId: string,
  ): Promise<FriendRequestResponseDto[]> {
    const requests = await this.friendRepo.getUserRequests(userId, 'incoming');
    return requests.map((req) => this.mapper.toFriendRequestResponse(req));
  }

  async getOutgoingFriendRequests(
    userId: string,
  ): Promise<FriendRequestResponseDto[]> {
    const requests = await this.friendRepo.getUserRequests(userId, 'outgoing');
    return requests.map((req) => this.mapper.toFriendRequestResponse(req));
  }

  async getAllBlackList(userId: string): Promise<BlacklistResponseDto[]> {
    const blacklist = await this.blacklistRepo.getUserBlacklist(userId);
    return blacklist.map((entry) => this.mapper.toBlacklistResponse(entry));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findUnique({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapper.toUserResponse(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepo.findMany();
    return users.map((user) => this.mapper.toUserResponse(user));
  }

  async searchUsersByQuery(
    currentUserId: string,
    query: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<{
    users: any[];
    total: number;
    hasMore: boolean;
  }> {
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

    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const friendship = await this.friendRepo.findFriendship(
          currentUserId,
          user.id,
        );
        const isBlocked = await this.blacklistRepo.checkBlocked(
          currentUserId,
          user.id,
        );
        const isBlockedByMe = await this.blacklistRepo.findBlock(
          currentUserId,
          user.id,
        );

        return {
          ...this.mapper.toUserResponse(user),
          friendshipStatus: friendship?.status || null,
          isBlocked: !!isBlocked,
          isBlockedByMe: !!isBlockedByMe,
        };
      }),
    );

    return {
      users: usersWithStatus,
      total,
      hasMore: offset + limit < total,
    };
  }

  private async ensureUserExists(id: string): Promise<void> {
    const exists = await this.userRepo.exists({ id });
    if (!exists) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
