// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CommonModule } from '../common/common.module';
import { TokenModule } from '../token/token.module'; // 👈 ДОБАВЬТЕ ЭТОТ ИМПОРТ
import { UserMapper } from '../users/mappers/user.mapper';

@Module({
  imports: [
    CommonModule,
    TokenModule, // 👈 ДОБАВЬТЕ TokenModule СЮДА
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserMapper],
  exports: [AuthService],
})
export class AuthModule {}
