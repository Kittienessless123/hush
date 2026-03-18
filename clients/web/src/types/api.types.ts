// DTO для запросов
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  publicKey?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface CreateChatRequest {
  userId: string; // ID второго пользователя
}

export interface SendMessageRequest {
  content: string;
  file?: File;
}

export interface UpdateProfileRequest {
  username?: string;
  publicKey?: string;
}

export interface UpdateSettingsRequest {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  language?: string;
}

// DTO для ответов
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User; // используем интерфейс User ниже
}

export interface User {
  id: string;
  username: string;
  login: string;
  passwordHash?: string; // опционально, чтобы не светить
  publicKey?: string;
  createdAt: string;
  updatedAt: string;
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
  text?: string;
  fileUrl?: string;
  fileType?: string;
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

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  notifications: {
    sound: boolean;
    popup: boolean;
    preview: boolean;
  };
  privacy: {
    lastSeen: boolean;
    readReceipts: boolean;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export const BASE_URL='http://localhost:3000'