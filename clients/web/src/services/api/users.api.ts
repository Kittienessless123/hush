// services/api/users.api.ts
import type { AxiosResponse } from "axios";
import { $api } from "./axios.config";
import type { User, Friend, UpdateProfileRequest } from "../../types/api.types";
import type { BlacklistItem } from "../../types/user.types";

export class UserService {
  static async getAllUsers(): Promise<AxiosResponse<User[]>> {
    return $api.get<User[]>("/users");
  }

  static async getUserById(id: string): Promise<AxiosResponse<User>> {
    return $api.get<User>(`/users/profile/${id}`);
  }

  static async updateProfile(
    id: string,
    data: UpdateProfileRequest,
  ): Promise<AxiosResponse<User>> {
    return $api.patch<User>(`/users/profile`, data);
  }

  static async deleteUser(): Promise<AxiosResponse<void>> {
    return $api.delete(`/users/profile`);
  }

  static async searchUsers(
    query: string,
    limit?: number,
    offset?: number,
  ): Promise<AxiosResponse<User[]>> {
    return $api.get<User[]>("/users/search", {
      params: { query, limit, offset },
    });
  }

  // Friends
  static async getFriends(): Promise<AxiosResponse<Friend[]>> {
    return $api.get<Friend[]>("/users/friends");
  }

  static async sendFriendRequest(
    targetUserId: string,
  ): Promise<AxiosResponse<Friend>> {
    return $api.post<Friend>("/users/friends/requests", { targetUserId });
  }

  static async acceptFriendRequest(
    requestId: string,
  ): Promise<AxiosResponse<Friend>> {
    return $api.patch<Friend>(`/users/friends/requests/${requestId}/accept`);
  }

  static async rejectFriendRequest(
    requestId: string,
  ): Promise<AxiosResponse<void>> {
    return $api.delete(`/users/friends/requests/${requestId}/reject`);
  }

  static async removeFriend(friendId: string): Promise<AxiosResponse<void>> {
    return $api.delete(`/users/friends/${friendId}`);
  }

  static async getIncomingRequests(): Promise<AxiosResponse<Friend[]>> {
    return $api.get<Friend[]>("/users/friends/requests/incoming");
  }

  static async getOutgoingRequests(): Promise<AxiosResponse<Friend[]>> {
    return $api.get<Friend[]>("/users/friends/requests/outgoing");
  }

  // Blacklist
  static async getBlacklist(): Promise<AxiosResponse<BlacklistItem[]>> {
    return $api.get<BlacklistItem[]>("/users/blacklist");
  }

  static async blockUser(
    userId: string,
    reason?: string,
  ): Promise<AxiosResponse<BlacklistItem>> {
    return $api.post<BlacklistItem>("/users/blacklist", { userId, reason });
  }

  static async unblockUser(blockId: string): Promise<AxiosResponse<void>> {
    return $api.delete(`/users/blacklist/${blockId}`);
  }
}
