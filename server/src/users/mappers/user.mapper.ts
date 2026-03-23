/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/users/mappers/user.mapper.ts
import { Injectable } from '@nestjs/common';
import { User, UserSettings } from '../../generated/client';
import { UserResponseDto } from '../dto/user-response.dto/user-response.dto';
import { FriendWithUsers } from '../../common/repositories/friend.repository';
import {
  FriendRequestResponseDto,
  FriendResponseDto,
} from '../dto/friens-response.dto';
import { BlacklistWithUser } from '../../common/repositories/blacklist.repository';
import { BlacklistResponseDto } from '../dto/settings-response.dto';
import { SettingsResponseDto } from '../dto/settings-response.dto';

@Injectable()
export class UserMapper {
  toUserResponse(
    user: User & { settings?: UserSettings | null },
  ): UserResponseDto {
    return new UserResponseDto({
      id: user.id,
      username: user.username,
      login: user.login,
      email: user.email ?? undefined,
      avatar: user.avatar ?? undefined,
      phone: user.phone ?? undefined,
      description: user.description ?? undefined,
      onlineStatus: user.onlineStatus,
      lastSeen: user.lastSeen ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  toFriendRequestResponse(request: FriendWithUsers): FriendRequestResponseDto {
    return {
      id: request.id,
      status: request.status,
      user: {
        id: request.user.id,
        username: request.user.username,
        login: request.user.login,
        email: request.user.email!,
        avatar: request.user.avatar ?? undefined,
      },
      friend: {
        id: request.friend.id,
        username: request.friend.username,
        login: request.friend.login,
        email: request.friend.email!,
        avatar: request.friend.avatar ?? undefined,
      },
      createdAt: request.createdAt,
    };
  }

  toFriendResponse(request: FriendWithUsers): FriendResponseDto {
    return {
      id: request.id,
      user: {
        id: request.user.id,
        username: request.user.username,
        login: request.user.login,
        email: request.user.email!,
        avatar: request.user.avatar ?? undefined,
        onlineStatus: request.user.onlineStatus,
        lastSeen: request.user.lastSeen ?? undefined,
      },
      friend: {
        id: request.friend.id,
        username: request.friend.username,
        login: request.friend.login,
        email: request.friend.email!,
        avatar: request.friend.avatar ?? undefined,
        onlineStatus: request.friend.onlineStatus,
        lastSeen: request.friend.lastSeen ?? undefined,
      },
      status: request.status,
      createdAt: request.createdAt,
    };
  }

  toBlacklistResponse(entry: BlacklistWithUser): BlacklistResponseDto {
    return {
      id: entry.id,
      user: {
        id: entry.blocked.id,
        username: entry.blocked.username,
        login: entry.blocked.login,
        email: entry.blocked.email!,
        avatar: entry.blocked.avatar ?? undefined,
        onlineStatus: entry.blocked.onlineStatus,
      },
      reason: entry.reason ?? undefined,
      createdAt: entry.createdAt,
    };
  }

  toSettingsResponse(settings: UserSettings): SettingsResponseDto {
    return {
      theme: settings.theme as 'system' | 'light' | 'dark',
      language: settings.language,
      notifications: settings.notifications as any,
      privacy: settings.privacy as any,
      security: {
        twoFactorAuth: settings.twoFactorAuth,
      },
    };
  }
}
