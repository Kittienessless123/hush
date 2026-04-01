/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeAutoObservable, runInAction } from "mobx";
import type { UserSettings, UpdateSettingsRequest } from "../types/api.types";
import { SettingsService } from "../services/api/settings.api";

export class SettingsStore {
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

  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isDarkTheme(): boolean {
    if (this.settings.theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return this.settings.theme === "dark";
  }

  setSettings(settings: UserSettings) {
    this.settings = settings;
    this.applyTheme(settings.theme);
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  async loadSettings() {
    this.setLoading(true);
    try {
      const { data } = await SettingsService.getSettings();
      runInAction(() => {
        this.settings = data;
        this.applyTheme(data.theme);
        this.setLoading(false);
      });
    } catch (error) {
      runInAction(() => {
        this.setError("Failed to load settings");
        this.setLoading(false);
      });
    }
  }

  async updateSettings(updates: UpdateSettingsRequest) {
    this.setLoading(true);
    try {
      const { data } = await SettingsService.updateSettings(updates);
      runInAction(() => {
        this.settings = data;
        this.applyTheme(data.theme);
        this.setLoading(false);
      });
      return true;
    } catch (error) {
      runInAction(() => {
        this.setError("Failed to update settings");
        this.setLoading(false);
      });
      return false;
    }
  }

  async updateTheme(theme: "light" | "dark" | "system") {
    await this.updateSettings({ theme });
  }

  async updateLanguage(language: string) {
    await this.updateSettings({ language });
  }

  async updateNotifications(
    key: keyof UserSettings["notifications"],
    value: boolean,
  ) {
    await this.updateSettings({
      notifications: {
        ...this.settings.notifications,
        [key]: value,
      },
    });
  }

  async updatePrivacy(key: keyof UserSettings["privacy"], value: unknown) {
    await this.updateSettings({
      privacy: {
        ...this.settings.privacy,
        [key]: value,
      },
    });
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
    this.settings = {
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
    this.error = null;
  }
}
