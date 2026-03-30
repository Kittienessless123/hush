import { UserRepository } from '../common/repositories/user.repository';
import { TokenRepository } from '../common/repositories/token.repository';
import { TokenService } from '../token/token.service';
import { UserMapper } from '../users/mappers/user.mapper';
import { LoginDto, RegisterDto, RefreshTokenDto, LogoutDto, ForgotPasswordDto, AuthResponseDto, TokenResponseDto, MessageResponseDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly userRepo;
    private readonly tokenRepo;
    private readonly tokenService;
    private readonly userMapper;
    constructor(userRepo: UserRepository, tokenRepo: TokenRepository, tokenService: TokenService, userMapper: UserMapper);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<TokenResponseDto>;
    logout(logoutDto: LogoutDto): Promise<MessageResponseDto>;
    logoutAll(userId: string): Promise<MessageResponseDto>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<MessageResponseDto>;
    getCurrentUser(userId: string): Promise<import("../users/dto").UserResponseDto>;
    validateUser(userId: string): Promise<{
        id: string;
        username: string;
        login: string;
        email: string | null;
    } | null>;
}
