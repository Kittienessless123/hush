/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/users/dto/user-response.dto.ts
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import type { UserSettings } from '@prisma/client';

@Exclude()
export class UserResponseDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  login: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? undefined)
  avatar?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? undefined)
  phone?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? undefined)
  description?: string;

  @Expose()
  @IsBoolean()
  onlineStatus: boolean;

  @Expose()
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => value ?? undefined)
  lastSeen?: Date;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;

  @Expose()
  @IsOptional()
  @Transform(({ obj }) => obj.settings)
  settings?: UserSettings;

  @Exclude()
  passwordHash: string;

  @Exclude()
  publicKey?: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

// Компактная версия для списков
@Exclude()
export class UserCompactDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  login: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsOptional()
  @IsString()
  avatar?: string;

  @Expose()
  @IsBoolean()
  onlineStatus: boolean;

  @Expose()
  @IsOptional()
  @IsDate()
  lastSeen?: Date;

  constructor(partial: Partial<UserCompactDto>) {
    Object.assign(this, partial);
  }
}
