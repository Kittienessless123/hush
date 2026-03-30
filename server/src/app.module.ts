import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 👈 ДОБАВЬТЕ ЭТОТ ИМПОРТ
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MessagesModule } from './messages/messages.module';
import { ChatModule } from './chats/chats.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './common/guards/jwt-auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({  // 👈 ДОБАВЬТЕ ЭТОТ МОДУЛЬ
      isGlobal: true,       // Делаем глобальным, чтобы не импортировать везде
      envFilePath: '.env',  // Указываем путь к .env файлу
    }),
    UsersModule,
    AuthModule,
    ChatModule,
    MessagesModule,
    PrismaModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}