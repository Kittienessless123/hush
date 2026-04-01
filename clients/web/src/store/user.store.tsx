/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeAutoObservable, runInAction } from "mobx";
import type { User, Friend, UserSettings } from "../types/api.types";
import { UserService } from "../services/api/users.api";
import { SettingsService } from "../services/api/settings.api";
import type { BlacklistItem } from "../types/user.types";

export class UserStore {
  profile: User | null = null;
  isLoading = false;
  error: string | null = null;

  friends: Friend[] = [];
  friendRequests: Friend[] = [];
  isLoadingFriends = false;

  blacklist: BlacklistItem[] = [];
  isLoadingBlacklist = false;

  settings: UserSettings = {
    theme: "system",
    language: "en",
    notifications: {
      sound: true,
      popup: true,
      preview: true,
    },
    privacy: {
      lastSeen: "everyone",
      readReceipts: true,
      onlineStatus: true,
    },
    twoFactorAuth: false,
  };

  searchResults: User[] = [];
  isSearching = false;

  constructor() {
    makeAutoObservable(this);
  }

  get friendList(): User[] {
    return this.friends
      .filter((f) => f.status === "accepted")
      .map((f) => f.friend);
  }

  get pendingRequests(): Friend[] {
    return this.friendRequests.filter((f) => f.status === "pending");
  }

  get blockedUsers(): BlacklistItem[] {
    return this.blacklist;
  }

  get isDarkTheme(): boolean {
    if (this.settings.theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return this.settings.theme === "dark";
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
        this.setError("Failed to load profile");
        this.setLoading(false);
      });
    }
  }

  async deleteAccount() {
    this.setLoading(true);
    try {
      await UserService.deleteUser();
      runInAction(() => {
        this.profile = null;
        this.friends = [];
        this.blacklist = [];
        this.setLoading(false);
      });
    } catch (error) {
      runInAction(() => {
        this.setError("Failed to delete account");
        this.setLoading(false);
      });
      throw error;
    }
  }
  async updateProfile(data: Partial<User>) {
    if (!this.profile) return;

    this.setLoading(true);
    try {
      const { data: updated } = await UserService.updateProfile(
        this.profile.id,
        data,
      );
      runInAction(() => {
        this.profile = updated;
        this.setLoading(false);
      });
    } catch (error) {
      runInAction(() => {
        this.setError("Failed to update profile");
        this.setLoading(false);
      });
    }
  }

  async loadFriends() {
    this.isLoadingFriends = true;
    try {
      const { data } = await UserService.getFriends();
      runInAction(() => {
        this.friends = data.filter((f: Friend) => f.status === "accepted");
        this.friendRequests = data.filter(
          (f: Friend) => f.status === "pending",
        );
        this.isLoadingFriends = false;
      });
    } catch (error) {
      runInAction(() => {
        this.setError("Failed to load friends");
        this.isLoadingFriends = false;
      });
    }
  }

  async acceptFriendRequest(requestId: string) {
    try {
      const { data } = await UserService.acceptFriendRequest(requestId);
      runInAction(() => {
        this.friendRequests = this.friendRequests.filter(
          (r) => r.id !== requestId,
        );
        this.friends.push(data);
      });
    } catch (error) {
      this.setError("Failed to accept friend request");
    }
  }

  async rejectFriendRequest(requestId: string) {
    try {
      await UserService.rejectFriendRequest(requestId);
      runInAction(() => {
        this.friendRequests = this.friendRequests.filter(
          (r) => r.id !== requestId,
        );
      });
    } catch (error) {
      this.setError("Failed to reject friend request");
    }
  }

  async removeFriend(friendId: string) {
    try {
      await UserService.removeFriend(friendId);
      runInAction(() => {
        this.friends = this.friends.filter((f) => f.id !== friendId);
      });
    } catch (error) {
      this.setError("Failed to remove friend");
    }
  }

  async blockUser(userId: string, reason?: string) {
    try {
      const { data } = await UserService.blockUser(userId, reason);
      runInAction(() => {
        this.blacklist.push(data);
        this.friends = this.friends.filter((f) => f.friendId !== userId);
      });
    } catch (error) {
      this.setError("Failed to block user");
    }
  }

  async loadSettings() {
    try {
      const { data } = await SettingsService.getSettings();
      runInAction(() => {
        this.settings = data;
        this.applyTheme(data.theme);
      });
    } catch (error) {
      this.setError("Failed to load settings");
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
      this.setError("Failed to update settings");
    }
  }

  async changeTheme(theme: "light" | "dark" | "system") {
    await this.updateSettings({ theme });
  }

  async changeLanguage(language: string) {
    await this.updateSettings({ language });
  }

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
        this.setError("Failed to search users");
        this.isSearching = false;
      });
    }
  }

  clearSearch() {
    this.searchResults = [];
  }

  private applyTheme(theme: "light" | "dark" | "system") {
    const root = document.documentElement;

    if (theme === "system") {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      root.classList.toggle("dark", systemDark);
    } else {
      root.classList.toggle("dark", theme === "dark");
    }
  }

  reset() {
    this.profile = null;
    this.friends = [];
    this.friendRequests = [];
    this.blacklist = [];
    this.searchResults = [];
    this.error = null;
  }

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
        this.setError("Failed to load blacklist");
        this.isLoadingBlacklist = false;
      });
    }
  }

  async unblockUser(blockId: string) {
    try {
      await UserService.unblockUser(blockId);
      runInAction(() => {
        this.blacklist = this.blacklist.filter((b) => b.id !== blockId);
      });
    } catch (error) {
      this.setError("Failed to unblock user");
      throw error;
    }
  }

  async sendFriendRequest(userId: string) {
    try {
      const { data } = await UserService.sendFriendRequest(userId);
      runInAction(() => {
        this.friendRequests.push(data);
      });
    } catch (error) {
      this.setError("Failed to send friend request");
      throw error;
    }
  }
}
