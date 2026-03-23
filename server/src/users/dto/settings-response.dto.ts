// dto/settings-response.dto.ts
export class SettingsResponseDto {
  theme: 'system' | 'light' | 'dark';
  language: string;
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
  };
}

// dto/blacklist-response.dto.ts
export class BlacklistResponseDto {
  id: string;
  user: {
    id: string;
    username: string;
    login: string;
    email: string;
    avatar?: string;
    onlineStatus: boolean;
  };
  reason?: string;
  createdAt: Date;
}
