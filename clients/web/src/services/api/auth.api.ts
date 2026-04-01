import type { AxiosResponse } from "axios";
import { $api } from "./axios.config";
import type {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  LogoutRequest,
  AuthResponse,
  User,
} from "../../types/api.types";

export class AuthService {
  
  static async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<AxiosResponse<{ message: string }>> {
    return $api.patch("/users/settings/password", data);
  }

  static async login(data: LoginRequest): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>("/auth/login", data);
  }

  static async register(
    data: RegisterRequest,
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>("/auth/register", data);
  }

  static async logout(
    data: LogoutRequest,
  ): Promise<AxiosResponse<{ message: string }>> {
    return $api.post("/auth/logout", data);
  }

  static async logoutAll(): Promise<AxiosResponse<{ message: string }>> {
    return $api.post("/auth/logout-all");
  }

  static async refreshToken(
    data: RefreshTokenRequest,
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>("/auth/refresh", data);
  }

  static async getMe(): Promise<AxiosResponse<User>> {
    return $api.get<User>("/auth/me");
  }

  static async validateSession(): Promise<
    AxiosResponse<{
      valid: boolean;
      user: { id: string; username: string; login: string };
    }>
  > {
    return $api.get("/auth/validate");
  }

  static async forgotPassword(
    email: string,
  ): Promise<AxiosResponse<{ message: string }>> {
    return $api.post("/auth/forgot-password", { email });
  }
}
