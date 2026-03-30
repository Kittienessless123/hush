// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CommonModule } from '../common/common.module'; // 👈 Импортируйте CommonModule
import { UserMapper } from './mappers/user.mapper';

@Module({
  imports: [CommonModule], // 👈 Все репозитории приходят из CommonModule
  controllers: [UsersController],
  providers: [
    UsersService,
    UserMapper,
    // Убираем репозитории отсюда - они уже в CommonModule
  ],
  exports: [UsersService, UserMapper], // 👈 Экспортируйте UserMapper если нужно
})
export class UsersModule {}
