// src/token/token.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { TokenRepository } from '../common/repositories/token.repository';
import { TokenMapper } from './mappers/token.mapper';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_EXPIRES_IN', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TokenController],
  providers: [TokenService, TokenRepository, TokenMapper],
  exports: [TokenService, TokenRepository],
})
export class TokenModule {}
