/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from "mobx";
import type { User } from "../types/api.types";
import { AuthService } from "../services/api/auth.api";

export class AuthStore {
  user: User | null = null;
  isAuthenticated = false;
  isLoading = true;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  async init() {
    await this.checkAuth();
  }

  setUser = (user: User | null) => {
    this.user = user;
    this.isAuthenticated = !!user;
  };

  setLoading = (loading: boolean) => {
    this.isLoading = loading;
  };

  setError = (error: string | null) => {
    this.error = error;
  };

  login = async (identifier: string, password: string) => {
    this.setLoading(true);
    this.setError(null);

    try {
      const { data } = await AuthService.login({
        identifier,
        password,
        deviceInfo: "Web Client",
      });

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      runInAction(() => {
        this.user = data.user;
        this.isAuthenticated = true;
        this.setLoading(false);
      });

      return data;
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.response?.data?.message || "Login failed");
        this.setLoading(false);
      });
      throw error;
    }
  };

  register = async (
    username: string,
    login: string,
    email: string,
    password: string,
  ) => {
    this.setLoading(true);
    this.setError(null);

    try {
      const { data } = await AuthService.register({
        username,
        login,
        email,
        password,
      });

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      runInAction(() => {
        this.user = data.user;
        this.isAuthenticated = true;
        this.setLoading(false);
      });

      return data;
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.response?.data?.message || "Registration failed");
        this.setLoading(false);
      });
      throw error;
    }
  };
  async changePassword(currentPassword: string, newPassword: string) {
    this.setLoading(true);
    this.setError(null);

    try {
      const { data } = await AuthService.changePassword({
        currentPassword,
        newPassword,
      });

      runInAction(() => {
        this.setLoading(false);
      });

      return data;
    } catch (error: any) {
      runInAction(() => {
        this.setError(
          error.response?.data?.message || "Password change failed",
        );
        this.setLoading(false);
      });
      throw error;
    }
  }

  logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      if (refreshToken) {
        await AuthService.logout({ refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      runInAction(() => {
        this.user = null;
        this.isAuthenticated = false;
      });
    }
  };

  logoutAll = async () => {
    try {
      await AuthService.logoutAll();
    } catch (error) {
      console.error("Logout all error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      runInAction(() => {
        this.user = null;
        this.isAuthenticated = false;
      });
    }
  };

  checkAuth = async () => {
    this.setLoading(true);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      this.setLoading(false);
      return;
    }

    try {
      const { data } = await AuthService.getMe();

      runInAction(() => {
        this.user = data;
        this.isAuthenticated = true;
        this.setLoading(false);
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const { data } = await AuthService.refreshToken({ refreshToken });
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);

          const userData = await AuthService.getMe();
          runInAction(() => {
            this.user = userData.data;
            this.isAuthenticated = true;
            this.setLoading(false);
          });
          return;
        } catch (refreshError) {
          console.error("Refresh failed:", refreshError);
        }
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      runInAction(() => {
        this.user = null;
        this.isAuthenticated = false;
        this.setLoading(false);
      });
    }
  };
}
