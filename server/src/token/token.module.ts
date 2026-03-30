// src/auth/token/token.module.ts
import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule], // Все зависимости (JwtService, ConfigService, TokenRepository) приходят из CommonModule
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}