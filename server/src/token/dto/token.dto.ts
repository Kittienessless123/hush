// src/token/dto/token.dto.ts
import {
  IsJWT,
  IsString,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { Expose, Exclude } from 'class-transformer';

export class GenerateTokenDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  deviceInfo?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;
}

export class RefreshTokenDto {
  @IsJWT()
  refreshToken: string;
}

export class RevokeTokenDto {
  @IsUUID()
  tokenId: string;

  @IsUUID()
  userId: string;
}

@Exclude()
export class TokenResponseDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsUUID()
  userId: string;

  @Expose()
  @IsJWT()
  token: string;

  @Expose()
  @IsDate()
  expiresAt: Date;

  @Expose()
  @IsOptional()
  @IsString()
  deviceInfo?: string;

  @Expose()
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @Expose()
  @IsBoolean()
  revoked: boolean;

  @Expose()
  @IsDate()
  createdAt: Date;

  constructor(partial: Partial<TokenResponseDto>) {
    Object.assign(this, partial);
  }
}

export class TokenPayloadDto {
  @IsUUID()
  sub: string;

  @IsString()
  username: string;

  @IsString()
  login: string;

  @IsOptional()
  @IsString()
  deviceInfo?: string;

  @IsOptional()
  @IsString()
  tokenId?: string;
}

export class AuthTokensDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}
