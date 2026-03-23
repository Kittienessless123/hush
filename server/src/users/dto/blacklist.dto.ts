// src/users/dto/blacklist.dto.ts
import {
  IsUUID,
  IsString,
  IsOptional,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserCompactDto } from './user-response.dto/user-response.dto';

export class AddToBlacklistDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class BlacklistEntryDto {
  @IsUUID()
  id: string;

  @ValidateNested()
  @Type(() => UserCompactDto)
  user: UserCompactDto;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsDate()
  createdAt: Date;
}

export class BlacklistResponseDto extends BlacklistEntryDto {}

export class RemoveFromBlacklistDto {
  @IsUUID()
  userId: string;
}
