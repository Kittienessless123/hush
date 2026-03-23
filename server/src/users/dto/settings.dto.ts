// src/users/dto/settings.dto.ts
import {
  IsBoolean,
  IsString,
  IsOptional,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum Theme {
  SYSTEM = 'system',
  LIGHT = 'light',
  DARK = 'dark',
}

export enum LastSeenPrivacy {
  EVERYONE = 'everyone',
  CONTACTS = 'contacts',
  NOBODY = 'nobody',
}

export class NotificationsSettingsDto {
  @IsBoolean()
  @IsOptional()
  sound?: boolean;

  @IsBoolean()
  @IsOptional()
  popup?: boolean;

  @IsBoolean()
  @IsOptional()
  preview?: boolean;
}

export class PrivacySettingsDto {
  @IsEnum(LastSeenPrivacy)
  @IsOptional()
  lastSeen?: LastSeenPrivacy;

  @IsBoolean()
  @IsOptional()
  readReceipts?: boolean;

  @IsBoolean()
  @IsOptional()
  onlineStatus?: boolean;
}

export class SecuritySettingsDto {
  @IsBoolean()
  twoFactorAuth: boolean;
}

export class UpdateSettingsDto {
  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationsSettingsDto)
  notifications?: NotificationsSettingsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PrivacySettingsDto)
  privacy?: PrivacySettingsDto;

  @IsOptional()
  @IsBoolean()
  twoFactorAuth?: boolean;
}

// Response DTO для настроек
export interface IUserSettings {
  theme: Theme;
  language: string;
  notifications: NotificationsSettingsDto;
  privacy: PrivacySettingsDto;
  security: SecuritySettingsDto;
}

export class SettingsResponseDto implements IUserSettings {
  theme: Theme;
  language: string;
  notifications: NotificationsSettingsDto;
  privacy: PrivacySettingsDto;
  security: SecuritySettingsDto;

  constructor(partial: Partial<SettingsResponseDto>) {
    Object.assign(this, partial);
  }
}
