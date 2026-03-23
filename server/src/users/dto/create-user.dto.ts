/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsStrongPassword,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(20, { message: 'Username cannot exceed 20 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  @Transform(({ value }) => value?.trim().toLowerCase())
  username: string;

  @IsString()
  @MinLength(3, { message: 'Login must be at least 3 characters long' })
  @MaxLength(20, { message: 'Login cannot exceed 20 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Login can only contain letters, numbers, and underscores',
  })
  @Transform(({ value }) => value?.trim().toLowerCase())
  login: string;

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

  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @IsOptional()
  @IsString()
  publicKey?: string;
}
