// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { ChatController } from './chats.controller';
import { ChatService } from './chats.service';
import { ChatRepository } from '../common/repositories/chat.repository';
import { MessageRepository } from '../common/repositories/message.repository';
import { ChatMapper } from './mapper/chat.mapper';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from '../common/repositories/user.repository';
import { BlacklistRepository } from '../common/repositories/blacklist.repository';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatRepository,
    MessageRepository,
    ChatMapper,
    UserRepository,
    BlacklistRepository,
  ],
  exports: [ChatService],
})
export class ChatModule {}
