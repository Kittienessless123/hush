import { UserSettings } from '@prisma/client';

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Базовый DTO с общими полями
export class BaseDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Типы для пользовательских данных (без чувствительной инфы)
export interface IUserPublic {
  id: string;
  username: string;
  login: string;
  email: string;
  avatar?: string;
  onlineStatus: boolean;
  lastSeen?: Date;
}

export interface IUserPrivate extends IUserPublic {
  phone?: string;
  description?: string;
}

export interface IUserFull extends IUserPrivate {
  passwordHash: string;
  publicKey?: string;
  settings?: UserSettings;
}
