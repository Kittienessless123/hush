import type { AxiosResponse } from 'axios';
import { $api } from './axios.config';
import type { 
  Settings as SettingsResponse, 
  UpdateSettingsRequest 
} from '../../types/api.types';

export class SettingsService {
  static async getSettings(): Promise<AxiosResponse<SettingsResponse>> {
    return $api.get<SettingsResponse>('/settings');
  }

  static async updateSettings(data: UpdateSettingsRequest): Promise<AxiosResponse<SettingsResponse>> {
    return $api.patch<SettingsResponse>('/settings', data);
  }

  static async updateTheme(theme: string): Promise<AxiosResponse<SettingsResponse>> {
    return $api.patch<SettingsResponse>('/settings/theme', { theme });
  }

  static async toggleNotifications(): Promise<AxiosResponse<SettingsResponse>> {
    return $api.patch<SettingsResponse>('/settings/notifications/toggle');
  }
}