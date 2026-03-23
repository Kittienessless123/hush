import {
  IsUUID,
  IsString,
  IsDate,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserCompactDto } from './user-response.dto/user-response.dto';

export enum FriendStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

// Базовый DTO для отношений
export class FriendBaseDto {
  @IsUUID()
  id: string;

  @IsEnum(FriendStatus)
  status: FriendStatus;

  @IsDate()
  createdAt: Date;
}

// DTO для пользователя в контексте дружбы
export class FriendUserDto extends UserCompactDto {
  @IsOptional()
  @IsString()
  friendshipStatus?: FriendStatus;
}

// Запрос дружбы
export class FriendRequestResponseDto extends FriendBaseDto {
  @ValidateNested()
  @Type(() => UserCompactDto)
  user: UserCompactDto;

  @ValidateNested()
  @Type(() => UserCompactDto)
  friend: UserCompactDto;
}

// Ответ на запрос дружбы (с дополнительной информацией)
export class FriendResponseDto extends FriendBaseDto {
  @ValidateNested()
  @Type(() => FriendUserDto)
  user: FriendUserDto;

  @ValidateNested()
  @Type(() => FriendUserDto)
  friend: FriendUserDto;
}

// DTO для создания запроса
export class CreateFriendRequestDto {
  @IsUUID()
  targetUserId: string;
}

// DTO для ответа на запрос
export class RespondFriendRequestDto {
  @IsUUID()
  requestId: string;

  @IsEnum(FriendStatus)
  status: FriendStatus.ACCEPTED | FriendStatus.REJECTED;
}
