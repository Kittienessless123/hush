import { makeAutoObservable, runInAction } from 'mobx';
import type { User } from '../types/api.types';
import { AuthService } from '../services/api/auth.api';
import { socketService } from '../services/websocket/socket.config';

export class AuthStore {
  // ========== STATE ==========
  user: User | null = null;
  isAuthenticated = false;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // ========== ACTIONS ==========
  
  setUser(user: User | null) {
    this.user = user;
    this.isAuthenticated = !!user;
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  // ========== ASYNC ACTIONS ==========
  
  async login(email: string, password: string) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const { data } = await AuthService.login({ email, password });
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Подключаем сокет
      socketService.connect(data.accessToken);
      
      runInAction(() => {
        this.user = data.user;
        this.isAuthenticated = true;
        this.setLoading(false);
      });
    } catch (error) {
      runInAction(() => {
        this.setError(error instanceof Error ? error.message : 'Login failed');
        this.setLoading(false);
      });
    }
  }

  async logout() {
    try {
      await AuthService.logout();
    } finally {
      socketService.disconnect();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      this.user = null;
      this.isAuthenticated = false;
    }
  }

  async checkAuth() {
    this.setLoading(true);
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.setLoading(false);
      return;
    }
    
    try {
      const { data } = await AuthService.getMe();
      socketService.connect(token);
      
      runInAction(() => {
        this.user = data;
        this.isAuthenticated = true;
        this.setLoading(false);
      });
    } catch {
      runInAction(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.setLoading(false);
      });
    }
  }
}