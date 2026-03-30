// src/common/common.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { UserRepository } from './repositories/user.repository';
import { TokenRepository } from './repositories/token.repository';
import { FriendRepository } from './repositories/friend.repository';
import { BlacklistRepository } from './repositories/blacklist.repository';
import { SettingsRepository } from './repositories/settings.repository';
import { ChatRepository } from './repositories/chat.repository';
import { MessageRepository } from './repositories/message.repository';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_EXPIRES_IN', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    // Guards
    JwtAuthGuard,
    RolesGuard,
    // Repositories
    UserRepository,
    TokenRepository,
    FriendRepository,
    BlacklistRepository,
    SettingsRepository,
    ChatRepository,
    MessageRepository,
  ],
  exports: [
    // Guards
    JwtAuthGuard,
    RolesGuard,
    // Modules
    JwtModule,
    ConfigModule,
    // Repositories
    UserRepository,
    TokenRepository,
    FriendRepository,
    BlacklistRepository,
    SettingsRepository,
    ChatRepository,
    MessageRepository,
  ],
})
export class CommonModule {}
