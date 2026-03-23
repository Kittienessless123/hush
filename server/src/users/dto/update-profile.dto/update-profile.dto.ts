// src/users/dto/update-profile.dto.ts (отдельный для профиля)
import {
  IsString,
  IsOptional,
  IsUrl,
  MaxLength,
  IsPhoneNumber,
  IsEmail,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  avatar?: string;

  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;
}
