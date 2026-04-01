"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const user_repository_1 = require("../common/repositories/user.repository");
const token_repository_1 = require("../common/repositories/token.repository");
const token_service_1 = require("../token/token.service");
const user_mapper_1 = require("../users/mappers/user.mapper");
let AuthService = class AuthService {
    userRepo;
    tokenRepo;
    tokenService;
    userMapper;
    constructor(userRepo, tokenRepo, tokenService, userMapper) {
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
        this.tokenService = tokenService;
        this.userMapper = userMapper;
    }
    async register(registerDto) {
        const { isUnique, conflictField } = await this.userRepo.checkUnique({
            login: registerDto.login,
            username: registerDto.username,
            email: registerDto.email,
        });
        if (!isUnique) {
            throw new common_1.ConflictException(`User with this ${conflictField} already exists`);
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.userRepo.create({
            username: registerDto.username,
            login: registerDto.login,
            passwordHash: hashedPassword,
            email: registerDto.email,
            publicKey: registerDto.publicKey,
        });
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
                email: user.email,
                avatar: user.avatar ?? undefined,
            },
        };
    }
    async login(loginDto) {
        const { identifier, password, deviceInfo, ipAddress } = loginDto;
        const user = await this.userRepo.findByCredentials(identifier);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
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
                email: user.email,
                avatar: user.avatar ?? undefined,
            },
        };
    }
    async refresh(refreshTokenDto) {
        const { refreshToken } = refreshTokenDto;
        const tokens = await this.tokenService.refreshTokens(refreshToken);
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresIn: tokens.expiresIn,
            tokenType: 'Bearer',
        };
    }
    async logout(logoutDto) {
        const { refreshToken } = logoutDto;
        const tokenEntity = await this.tokenRepo.findByToken(refreshToken);
        if (!tokenEntity) {
            return { message: 'Logged out successfully' };
        }
        if (tokenEntity.revoked) {
            return { message: 'Logged out successfully' };
        }
        await this.tokenRepo.revokeToken(tokenEntity.id);
        const checkToken = await this.tokenRepo.findByToken(refreshToken);
        return { message: 'Logged out successfully' };
    }
    async logoutAll(userId) {
        const count = await this.tokenRepo.revokeAllUserTokens(userId);
        return {
            message: `Logged out from all devices. ${count} sessions terminated.`,
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.userRepo.findUnique({ email });
        if (!user) {
            return {
                message: 'If your email is registered, you will receive a password reset link',
            };
        }
        return {
            message: 'If your email is registered, you will receive a password reset link',
        };
    }
    async getCurrentUser(userId) {
        const user = await this.userRepo.findUnique({ id: userId });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.userMapper.toUserResponse(user);
    }
    async validateUser(userId) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        token_repository_1.TokenRepository,
        token_service_1.TokenService,
        user_mapper_1.UserMapper])
], AuthService);
//# sourceMappingURL=auth.service.js.map