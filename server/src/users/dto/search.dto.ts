// src/users/dto/search.dto.ts
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FriendStatus } from './friend.dto';
import { UserCompactDto } from './user-response.dto/user-response.dto';

export class SearchUsersQueryDto {
  @IsString()
  @IsOptional()
  query?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}

export class SearchResultUserDto extends UserCompactDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(FriendStatus)
  friendshipStatus?: FriendStatus | null;

  @IsBoolean()
  isBlocked: boolean;

  @IsBoolean()
  isBlockedByMe: boolean;
}

export class SearchUsersResponseDto {
  users: SearchResultUserDto[];
  total: number;
  hasMore: boolean;

  constructor(partial: Partial<SearchUsersResponseDto>) {
    Object.assign(this, partial);
  }
}
