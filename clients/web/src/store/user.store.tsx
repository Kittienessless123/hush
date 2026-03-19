/* import { makeAutoObservable, runInAction } from 'mobx';
import type { 
  User, 
  Friend, 
  BlacklistItem, 
  UserSettings,
  Theme,
  Language,
  UpdateProfileData,
  ChangePasswordData,
  PrivacySettings,
  Session
} from '../types/user.types';
import { UserService } from '../services/api/users.api';
import { SettingsService } from '../services/api/settings.api';
import { AuthService } from '../services/api/auth.api';
import { messageSocket } from '../services/websocket/messages.socket';

export class UserStore {
  // ========== STATE ==========
  
  // Профиль
  profile: User | null = null;
  isLoading = false;
  error: string | null = null;
  
  // Друзья
  friends: Friend[] = [];
  friendRequests: Friend[] = [];
  isLoadingFriends = false;
  
  // Черный список
  blacklist: BlacklistItem[] = [];
  isLoadingBlacklist = false;
  
  // Настройки
  settings: UserSettings = {
    theme: 'system',
    language: 'en',
    notifications: {
      sound: true,
      popup: true,
      preview: true,
    },
    privacy: {
      lastSeen: 'everyone',
      readReceipts: true,
      onlineStatus: true,
    },
    security: {
      twoFactorAuth: false,
      activeSessions: [],
    },
  };
  
  // Поиск
  searchResults: User[] = [];
  isSearching = false;

  constructor() {
    makeAutoObservable(this);
  }

  // ========== COMPUTED ==========
  
  get friendList(): User[] {
    return this.friends
      .filter(f => f.status === 'accepted')
      .map(f => f.friend);
  }

  get pendingRequests(): Friend[] {
    return this.friendRequests.filter(f => f.status === 'pending');
  }

  get blockedUsers(): BlacklistItem[] {
    return this.blacklist;
  }

  get isDarkTheme(): boolean {
    if (this.settings.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.settings.theme === 'dark';
  }

  // ========== ACTIONS ==========
  
  setProfile(profile: User | null) {
    this.profile = profile;
  }

  setFriends(friends: Friend[]) {
    this.friends = friends;
  }

  setFriendRequests(requests: Friend[]) {
    this.friendRequests = requests;
  }

  setBlacklist(blacklist: BlacklistItem[]) {
    this.blacklist = blacklist;
  }

  setSettings(settings: Partial<UserSettings>) {
    this.settings = { ...this.settings, ...settings };
    
    // Применяем тему сразу
    if (settings.theme) {
      this.applyTheme(settings.theme);
    }
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  // ========== ПРОФИЛЬ ==========
  
  async loadProfile(userId: string) {
    this.setLoading(true);
    try {
      const { data } = await UserService.getUserById(userId);
      runInAction(() => {
        this.profile = data;
        this.setLoading(false);
      });
    } catch (error) {
      runInAction(() => {
        this.setError('Failed to load profile');
        this.setLoading(false);
      });
    }
  }

  async updateProfile(data: UpdateProfileData) {
    if (!this.profile) return;
    
    this.setLoading(true);
    try {
      const { data: updated } = await UserService.updateProfile(this.profile.id, data);
      runInAction(() => {
        this.profile = updated;
        this.setLoading(false);
      });
    } catch (error) {
      runInAction(() => {
        this.setError('Failed to update profile');
        this.setLoading(false);
      });
    }
  }

  async changePassword(data: ChangePasswordData) {
    if (data.newPassword !== data.confirmPassword) {
      this.setError('Passwords do not match');
      return;
    }
    
    this.setLoading(true);
    try {
      await AuthService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      runInAction(() => {
        this.setLoading(false);
      });
    } catch (error) {
      runInAction(() => {
        this.setError('Failed to change password');
        this.setLoading(false);
      });
    }
  }

  async changeUsername(username: string) {
    await this.updateProfile({ username });
  }

  async changeEmail(email: string) {
    await this.updateProfile({ email });
  }

  async deleteAccount() {
    if (!this.profile) return;
    
    this.setLoading(true);
    try {
      await UserService.deleteUser(this.profile.id);
      runInAction(() => {
        this.profile = null;
        this.friends = [];
        this.blacklist = [];
        this.setLoading(false);
      });
    } catch (error) {
      runInAction(() => {
        this.setError('Failed to delete account');
        this.setLoading(false);
      });
    }
  }

  // ========== ДРУЗЬЯ ==========
  
  async loadFriends() {
    this.isLoadingFriends = true;
    try {
      const { data } = await UserService.getFriends();
      runInAction(() => {
        this.friends = data.filter((f: Friend) => f.status === 'accepted');
        this.friendRequests = data.filter((f: Friend) => f.status === 'pending');
        this.isLoadingFriends = false;
      });
    } catch (error) {
      runInAction(() => {
        this.setError('Failed to load friends');
        this.isLoadingFriends = false;
      });
    }
  }

  async addFriend(userId: string) {
    try {
      const { data } = await UserService.sendFriendRequest(userId);
      runInAction(() => {
        this.friendRequests.push(data);
      });
      
      // Уведомление через сокет
      messageSocket.sendFriendRequest({ userId });
    } catch (error) {
      this.setError('Failed to send friend request');
    }
  }

  async acceptFriendRequest(requestId: string) {
    try {
      const { data } = await UserService.acceptFriendRequest(requestId);
      runInAction(() => {
        this.friendRequests = this.friendRequests.filter(r => r.id !== requestId);
        this.friends.push(data);
      });
    } catch (error) {
      this.setError('Failed to accept friend request');
    }
  }

  async rejectFriendRequest(requestId: string) {
    try {
      await UserService.rejectFriendRequest(requestId);
      runInAction(() => {
        this.friendRequests = this.friendRequests.filter(r => r.id !== requestId);
      });
    } catch (error) {
      this.setError('Failed to reject friend request');
    }
  }

  async removeFriend(friendId: string) {
    try {
      await UserService.removeFriend(friendId);
      runInAction(() => {
        this.friends = this.friends.filter(f => f.id !== friendId);
      });
    } catch (error) {
      this.setError('Failed to remove friend');
    }
  }

  // ========== ЧЕРНЫЙ СПИСОК ==========
  
  async loadBlacklist() {
    this.isLoadingBlacklist = true;
    try {
      const { data } = await UserService.getBlacklist();
      runInAction(() => {
        this.blacklist = data;
        this.isLoadingBlacklist = false;
      });
    } catch (error) {
      runInAction(() => {
        this.setError('Failed to load blacklist');
        this.isLoadingBlacklist = false;
      });
    }
  }

  async blockUser(userId: string, reason?: string) {
    try {
      const { data } = await UserService.blockUser(userId, reason);
      runInAction(() => {
        this.blacklist.push(data);
        // Удаляем из друзей, если был
        this.friends = this.friends.filter(f => f.friendId !== userId);
      });
    } catch (error) {
      this.setError('Failed to block user');
    }
  }

  async unblockUser(blockId: string) {
    try {
      await UserService.unblockUser(blockId);
      runInAction(() => {
        this.blacklist = this.blacklist.filter(b => b.id !== blockId);
      });
    } catch (error) {
      this.setError('Failed to unblock user');
    }
  }

  // ========== НАСТРОЙКИ ==========
  
  async loadSettings() {
    try {
      const { data } = await SettingsService.getSettings();
      runInAction(() => {
        this.settings = data;
        this.applyTheme(data.theme);
      });
    } catch (error) {
      this.setError('Failed to load settings');
    }
  }

  async updateSettings(settings: Partial<UserSettings>) {
    try {
      const { data } = await SettingsService.updateSettings(settings);
      runInAction(() => {
        this.settings = data;
        this.applyTheme(data.theme);
      });
    } catch (error) {
      this.setError('Failed to update settings');
    }
  }

  async changeTheme(theme: Theme) {
    await this.updateSettings({ theme });
  }

  async changeLanguage(language: Language) {
    await this.updateSettings({ language });
  }

  async updatePrivacy(privacy: PrivacySettings) {
    await this.updateSettings({
      privacy: { ...this.settings.privacy, ...privacy },
    });
  }

  async toggleNotifications(key: keyof typeof this.settings.notifications) {
    await this.updateSettings({
      notifications: {
        ...this.settings.notifications,
        [key]: !this.settings.notifications[key],
      },
    });
  }

  async toggleTwoFactorAuth(enable: boolean) {
    try {
      await SettingsService.toggleTwoFactorAuth(enable);
      runInAction(() => {
        this.settings.security.twoFactorAuth = enable;
      });
    } catch (error) {
      this.setError('Failed to toggle two-factor authentication');
    }
  }

  // ========== СЕССИИ ==========
  
  async loadSessions() {
    try {
      const { data } = await AuthService.getSessions();
      runInAction(() => {
        this.settings.security.activeSessions = data;
      });
    } catch (error) {
      this.setError('Failed to load sessions');
    }
  }

  async terminateSession(sessionId: string) {
    try {
      await AuthService.terminateSession(sessionId);
      runInAction(() => {
        this.settings.security.activeSessions = 
          this.settings.security.activeSessions.filter(s => s.id !== sessionId);
      });
    } catch (error) {
      this.setError('Failed to terminate session');
    }
  }

  async terminateAllOtherSessions() {
    try {
      await AuthService.terminateAllOtherSessions();
      await this.loadSessions(); // перезагружаем список
    } catch (error) {
      this.setError('Failed to terminate sessions');
    }
  }

  // ========== ПОИСК ==========
  
  async searchUsers(query: string) {
    if (!query.trim()) {
      this.searchResults = [];
      return;
    }
    
    this.isSearching = true;
    try {
      const { data } = await UserService.searchUsers(query);
      runInAction(() => {
        this.searchResults = data;
        this.isSearching = false;
      });
    } catch (error) {
      runInAction(() => {
        this.setError('Failed to search users');
        this.isSearching = false;
      });
    }
  }

  clearSearch() {
    this.searchResults = [];
  }

  // ========== ВСПОМОГАТЕЛЬНЫЕ ==========
  
  private applyTheme(theme: Theme) {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }

  // ========== LAST SEEN ==========
  
  async updateLastSeen(chatId: string) {
    try {
      await UserService.updateLastSeen(chatId);
    } catch (error) {
      console.error('Failed to update last seen:', error);
    }
  }

  // ========== ОЧИСТКА ==========
  
  reset() {
    this.profile = null;
    this.friends = [];
    this.friendRequests = [];
    this.blacklist = [];
    this.searchResults = [];
    this.error = null;
  }
} */