import type { AxiosResponse } from 'axios';
import { $api } from './axios.config';
import type { 
  LoginRequest, 
  RegisterRequest, 
  RefreshTokenRequest,
  AuthResponse,
  User,
} from '../../types/api.types';

export class AuthService {
  static async login(data: LoginRequest): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/auth/login', data);
  }

  static async register(data: RegisterRequest): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/auth/register', data);
  }

  static async logout(): Promise<AxiosResponse<void>> {
    return $api.post('/auth/logout');
  }

  static async refreshToken(data: RefreshTokenRequest): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/auth/refresh', data);
  }

  static async getMe(): Promise<AxiosResponse<User>> {
    return $api.get<User>('/auth/me');
  }
}