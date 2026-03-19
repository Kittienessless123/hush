import type { User } from './api.types';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'ru';

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friend: User;
  createdAt: string;
  status: 'pending' | 'accepted' | 'blocked';
}

export interface BlacklistItem {
  id: string;
  userId: string;
  blockedUserId: string;
  blockedUser: User;
  createdAt: string;
  reason?: string;
}

export interface UserSettings {
  theme: Theme;
  language: Language;
  notifications: {
    sound: boolean;
    popup: boolean;
    preview: boolean;
  };
  privacy: {
    lastSeen: 'everyone' | 'contacts' | 'nobody';
    readReceipts: boolean;
    onlineStatus: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    activeSessions: Session[];
  };
}

export interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
  publicKey?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PrivacySettings {
  lastSeen?: 'everyone' | 'contacts' | 'nobody';
  readReceipts?: boolean;
  onlineStatus?: boolean;
}