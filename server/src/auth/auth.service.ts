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
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UserRepository } from '../common/repositories/user.repository';
import { TokenRepository } from '../common/repositories/token.repository';
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
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

    // Generate tokens
    const tokens = await this.generateTokens(user.id, undefined);

    return {
      ...tokens,
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

    // Generate tokens
    const tokens = await this.generateTokens(user.id, deviceInfo, ipAddress);

    return {
      ...tokens,
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

    // Find token in database
    const tokenEntity = await this.tokenRepo.findByToken(refreshToken);
    if (!tokenEntity) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token is revoked
    if (tokenEntity.revoked) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    // Check if token is expired
    if (tokenEntity.expiresAt < new Date()) {
      // Revoke expired token
      await this.tokenRepo.revokeToken(tokenEntity.id);
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Verify JWT
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // Revoke old token
      await this.tokenRepo.revokeToken(tokenEntity.id);

      // Generate new tokens
      const tokens = await this.generateTokens(
        payload.sub,
        tokenEntity.deviceInfo ?? undefined,
      );

      return tokens;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // Revoke expired token
        await this.tokenRepo.revokeToken(tokenEntity.id);
        throw new UnauthorizedException('Refresh token has expired');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
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
      // For security, don't reveal if email exists or not
      return {
        message:
          'If your email is registered, you will receive a password reset link',
      };
    }

    // Generate password reset token

    // Save reset token to user (you'd need to add these fields to schema)
    // await this.userRepo.update({ id: user.id }, {
    //   resetPasswordToken: resetToken,
    //   resetPasswordExpires: resetTokenExpires,
    // });

    // TODO: Send email with reset link
    // await this.emailService.sendPasswordResetEmail(email, resetToken);

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

  private async generateTokens(
    userId: string,
    deviceInfo?: string,
    ipAddress?: string,
  ): Promise<TokenResponseDto> {
    // Generate access token
    const accessToken = this.jwtService.sign(
      {
        sub: userId,
        deviceInfo,
      },
      {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '1h'),
      },
    );

    // Generate refresh token
    const refreshToken = randomBytes(40).toString('hex');
    const expiresInDays = this.configService.get(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    );

    // Calculate expiration date
    let expiresAt: Date;
    if (typeof expiresInDays === 'string' && expiresInDays.endsWith('d')) {
      const days = parseInt(expiresInDays);
      expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    } else {
      const seconds = parseInt(expiresInDays as string);
      expiresAt = new Date(Date.now() + seconds * 1000);
    }

    // Save refresh token to database
    await this.tokenRepo.create({
      userId,
      token: refreshToken,
      expiresAt,
      deviceInfo,
      ipAddress,
    });

    // Get expires in seconds
    const expiresIn = this.configService.get('JWT_ACCESS_EXPIRES_IN', 3600);
    const expiresInSeconds =
      typeof expiresIn === 'string' ? parseInt(expiresIn) : expiresIn;

    return {
      accessToken,
      refreshToken,
      expiresIn: expiresInSeconds,
      tokenType: 'Bearer',
    };
  }
}
