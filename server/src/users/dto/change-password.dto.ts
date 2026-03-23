/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  IsString,
  MinLength,
  IsStrongPassword,
  ValidateIf,
  Matches,
} from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(1, { message: 'Current password is required' })
  currentPassword: string;

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
        'New password must be at least 8 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol',
    },
  )
  newPassword: string;

  @IsString()
  @ValidateIf((o) => o.newPassword !== undefined)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'Confirm password must match the password requirements',
    },
  )
  confirmPassword: string;

  static validatePasswords(dto: ChangePasswordDto): boolean {
    return dto.newPassword === dto.confirmPassword;
  }
}
