/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../common/repositories/user.repository';
import { TokenRepository } from '../common/repositories/token.repository';
import { TokenService } from '../token/token.service';
import { UserMapper } from '../users/mappers/user.mapper';
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  LogoutDto,
  ForgotPasswordDto,
  AuthResponseDto,
  TokenResponseDto,
  MessageResponseDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tokenRepo: TokenRepository,
    private readonly tokenService: TokenService,
    private readonly userMapper: UserMapper,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Check if user exists
    const { isUnique, conflictField } = await this.userRepo.checkUnique({
      login: registerDto.login,
      username: registerDto.username,
      email: registerDto.email,
    });

    if (!isUnique) {
      throw new ConflictException(
        `User with this ${conflictField} already exists`,
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await this.userRepo.create({
      username: registerDto.username,
      login: registerDto.login,
      passwordHash: hashedPassword,
      email: registerDto.email,
      publicKey: registerDto.publicKey,
    });

    // Generate tokens using TokenService
    const tokens = await this.tokenService.generateTokens({
      userId: user.id,
      deviceInfo: undefined,
      ipAddress: undefined,
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      tokenType: 'Bearer',
      user: {
        id: user.id,
        username: user.username,
        login: user.login,
        email: user.email!,
        avatar: user.avatar ?? undefined,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { identifier, password, deviceInfo, ipAddress } = loginDto;

    // Find user by email or login
    const user = await this.userRepo.findByCredentials(identifier);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens using TokenService
    const tokens = await this.tokenService.generateTokens({
      userId: user.id,
      deviceInfo,
      ipAddress,
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      tokenType: 'Bearer',
      user: {
        id: user.id,
        username: user.username,
        login: user.login,
        email: user.email!,
        avatar: user.avatar ?? undefined,
      },
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<TokenResponseDto> {
    const { refreshToken } = refreshTokenDto;

    // Use TokenService for refresh
    const tokens = await this.tokenService.refreshTokens(refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      tokenType: 'Bearer', // 👈 ДОБАВЬТЕ ЭТО
    };
  }
  async logout(logoutDto: LogoutDto): Promise<MessageResponseDto> {
    const { refreshToken } = logoutDto;

    // Find and revoke the refresh token
    const tokenEntity = await this.tokenRepo.findByToken(refreshToken);
    if (tokenEntity) {
      await this.tokenRepo.revokeToken(tokenEntity.id);
    }

    return { message: 'Logged out successfully' };
  }

  async logoutAll(userId: string): Promise<MessageResponseDto> {
    const count = await this.tokenRepo.revokeAllUserTokens(userId);
    return {
      message: `Logged out from all devices. ${count} sessions terminated.`,
    };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<MessageResponseDto> {
    const { email } = forgotPasswordDto;

    const user = await this.userRepo.findUnique({ email });
    if (!user) {
      return {
        message:
          'If your email is registered, you will receive a password reset link',
      };
    }

    // TODO: Send email with reset link

    return {
      message:
        'If your email is registered, you will receive a password reset link',
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userRepo.findUnique({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userMapper.toUserResponse(user);
  }

  async validateUser(userId: string) {
    const user = await this.userRepo.findUnique({ id: userId });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      username: user.username,
      login: user.login,
      email: user.email,
    };
  }
}
