/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/auth/dto/auth.dto.ts
import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  IsStrongPassword,
  Matches,
  IsJWT,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email or login' })
  @IsString()
  @Transform(({ value }) => value?.trim().toLowerCase())
  identifier: string;

  @ApiProperty({ example: 'Password123!', description: 'User password' })
  @IsString()
  password: string;

  @ApiProperty({
    required: false,
    description: 'Device info for refresh token',
  })
  @IsOptional()
  @IsString()
  deviceInfo?: string;

  @ApiProperty({ required: false, description: 'IP address for security' })
  @IsOptional()
  @IsString()
  ipAddress?: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'john_doe', description: 'Unique username' })
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(20, { message: 'Username cannot exceed 20 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  @Transform(({ value }) => value?.trim().toLowerCase())
  username: string;

  @ApiProperty({ example: 'johndoe', description: 'Unique login' })
  @IsString()
  @MinLength(3, { message: 'Login must be at least 3 characters long' })
  @MaxLength(20, { message: 'Login cannot exceed 20 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Login can only contain letters, numbers, and underscores',
  })
  @Transform(({ value }) => value?.trim().toLowerCase())
  login: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Strong password' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol',
    },
  )
  password: string;

  @ApiProperty({ required: false, description: 'Public key for encryption' })
  @IsOptional()
  @IsString()
  publicKey?: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsJWT()
  refreshToken: string;
}

export class LogoutDto {
  @ApiProperty({ description: 'Refresh token to revoke' })
  @IsString()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ description: 'Email address' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Password reset token' })
  @IsString()
  token: string;

  @ApiProperty({ description: 'New password' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol',
    },
  )
  newPassword: string;
}

export class VerifyEmailDto {
  @ApiProperty({ description: 'Email verification token' })
  @IsString()
  token: string;
}

// Response DTOs
export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: number;

  @ApiProperty()
  tokenType: string;

  @ApiProperty()
  user: {
    id: string;
    username: string;
    login: string;
    email: string;
    avatar?: string;
  };
}

export class TokenResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: number;

  @ApiProperty()
  tokenType: string;
}

export class MessageResponseDto {
  @ApiProperty()
  message: string;
}
