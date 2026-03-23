import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MessagesModule } from './messages/messages.module';
import { ChatsModule } from './chats/chats.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TokenModule } from './token/token.module';
import { JwtAuthGuard } from './common/guards/jwt-auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ChatsModule,
    MessagesModule,
    PrismaModule,
    TokenModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Apply globally
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Apply globally after JWT
    },
  ],
})
export class AppModule {}
