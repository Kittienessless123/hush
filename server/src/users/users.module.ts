import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BlacklistRepository } from 'src/common/repositories/blacklist.repository';
import { FriendRepository } from 'src/common/repositories/friend.repository';
import { SettingsRepository } from 'src/common/repositories/settings.repository';
import { UserRepository } from 'src/common/repositories/user.repository';
import { UserMapper } from './mappers/user.mapper';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    FriendRepository,
    BlacklistRepository,
    SettingsRepository,
    UserMapper,
  ],
  exports: [UsersService],
})
export class UsersModule {}
