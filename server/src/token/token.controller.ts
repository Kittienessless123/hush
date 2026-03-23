/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/token/token.controller.ts
import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Get,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { RefreshTokenDto, RevokeTokenDto } from './dto/token.dto';
import { CurrentUser } from '../common/decorators/current-user/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.tokenService.refreshTokens(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('revoke')
  async revokeToken(
    @Body() revokeTokenDto: RevokeTokenDto,
    @CurrentUser() currentUser: any,
  ) {
    // Ensure user can only revoke their own tokens
    if (revokeTokenDto.userId !== currentUser.id) {
      revokeTokenDto.userId = currentUser.id;
    }
    return this.tokenService.revokeToken(revokeTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('revoke-all')
  async revokeAllTokens(@CurrentUser() currentUser: any) {
    return this.tokenService.revokeAllUserTokens(currentUser.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-tokens')
  async getMyTokens(@CurrentUser() currentUser: any) {
    return this.tokenService.getUserTokens(currentUser.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('revoke/:tokenId')
  async revokeSpecificToken(
    @Param('tokenId', ParseUUIDPipe) tokenId: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.tokenService.revokeToken({
      tokenId,
      userId: currentUser.id,
    });
  }

  @Post('cleanup')
  async cleanupExpiredTokens() {
    // This should be protected with admin guard in production
    return this.tokenService.cleanupExpiredTokens();
  }
}
