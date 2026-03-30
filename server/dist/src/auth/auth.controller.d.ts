import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RefreshTokenDto, LogoutDto, ForgotPasswordDto, AuthResponseDto, TokenResponseDto, MessageResponseDto } from './dto/auth.dto';
import * as currentUserDecorator from '../common/decorators/current-user/current-user.decorator';
import { type CurrentUserPayload } from '../common/decorators/current-user/current-user.decorator';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<TokenResponseDto>;
    logout(logoutDto: LogoutDto): Promise<MessageResponseDto>;
    logoutAll(userId: string): Promise<MessageResponseDto>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<MessageResponseDto>;
    getCurrentUser(currentUser: CurrentUserPayload): Promise<import("../users/dto").UserResponseDto>;
    validateSession(currentUser: currentUserDecorator.CurrentUserPayload): {
        valid: boolean;
        user: {
            id: string;
            username: string;
            login: string;
        };
    };
}
