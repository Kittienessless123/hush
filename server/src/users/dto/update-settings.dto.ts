// update-settings.dto.ts
import { IsBoolean, IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  theme?: 'system' | 'light' | 'dark';

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsObject()
  notifications?: {
    sound?: boolean;
    popup?: boolean;
    preview?: boolean;
  };

  @IsOptional()
  @IsObject()
  privacy?: {
    lastSeen?: 'everyone' | 'contacts' | 'nobody';
    readReceipts?: boolean;
    onlineStatus?: boolean;
  };

  @IsOptional()
  @IsBoolean()
  twoFactorAuth?: boolean;
}
