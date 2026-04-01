// services/api/settings.api.ts
import type { AxiosResponse } from "axios";
import { $api } from "./axios.config";
import type {
  UserSettings,
  UpdateSettingsRequest,
} from "../../types/api.types";

export class SettingsService {
  static async getSettings(): Promise<AxiosResponse<UserSettings>> {
    return $api.get<UserSettings>("/users/settings");
  }

  static async updateSettings(
    data: UpdateSettingsRequest,
  ): Promise<AxiosResponse<UserSettings>> {
    return $api.patch<UserSettings>("/users/settings", data);
  }

  static async updateTheme(
    theme: string,
  ): Promise<AxiosResponse<UserSettings>> {
    return $api.patch<UserSettings>("/users/settings", { theme });
  }

  static async updatePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<AxiosResponse<{ message: string }>> {
    return $api.patch("/users/settings/password", data);
  }
}
