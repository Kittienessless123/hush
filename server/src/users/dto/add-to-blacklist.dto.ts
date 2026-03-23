// add-to-blacklist.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class AddToBlacklistDto {
  @IsString()
  userId: string; // ID пользователя, которого блокируем

  @IsOptional()
  @IsString()
  reason?: string; // Причина блокировки (опционально)
}
