// src/types/api.types.ts

// ========== REQUEST DTO ==========
export interface LoginRequest {
  identifier: string;
  password: string;
  deviceInfo?: string;
  ipAddress?: string;
}

export interface RegisterRequest {
  username: string;
  login: string;
  email: string;
  password: string;
  publicKey?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface CreateChatRequest {
  user2Id: string;
}

export interface SendMessageRequest {
  text?: string;
  fileUrl?: string;
  fileType?: string;
  encrypted?: boolean;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  avatar?: string | null;
  description?: string | null;
  phone?: string | null;
  publicKey?: string;
}

export interface UpdateSettingsRequest {
  theme?: "light" | "dark" | "system";
  language?: string;
  notifications?: {
    sound?: boolean;
    popup?: boolean;
    preview?: boolean;
  };
  privacy?: {
    lastSeen?: string;
    readReceipts?: boolean;
    onlineStatus?: boolean;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreateFriendRequest {
  targetUserId: string;
}

export interface AddToBlacklistRequest {
  userId: string;
  reason?: string;
}

export interface SearchUsersQuery {
  query: string;
  limit?: number;
  offset?: number;
}

// ========== RESPONSE DTO ==========
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  login: string;
  email: string;
  avatar?: string | null;
  onlineStatus?: boolean;
  lastSeen?: string | null;
  phone?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  settings?: UserSettings;
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  language: string;
  notifications: {
    sound: boolean;
    popup: boolean;
    preview: boolean;
  };
  privacy: {
    lastSeen: string;
    readReceipts: boolean;
    onlineStatus: boolean;
  };
  twoFactorAuth: boolean;
}

export interface Chat {
  id: string;
  user1Id: string;
  user2Id: string;
  user1: User;
  user2: User;
  messages?: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text?: string | null;
  fileUrl?: string | null;
  fileType?: string | null;
  encrypted: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: User;
}

export interface RefreshToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  deviceInfo?: string;
  revoked: boolean;
  createdAt: string;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  status: "pending" | "accepted" | "rejected";
  user: User;
  friend: User;
  createdAt: string;
  updatedAt: string;
}

export interface FriendRequest {
  id: string;
  userId: string;
  friendId: string;
  status: "pending" | "accepted" | "rejected";
  user: User;
  friend: User;
  createdAt: string;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export const BASE_URL = "http://localhost:3000/api";
