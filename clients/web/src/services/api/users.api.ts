import type { AxiosResponse } from 'axios';
import { $api } from './axios.config';
import type { 
  User, 
  UpdateProfileRequest 
} from '../../types/api.types';

export class UserService {
  static async getAllUsers(): Promise<AxiosResponse<User[]>> {
    return $api.get<User[]>('/users');
  }

  static async getUserById(id: string): Promise<AxiosResponse<User>> {
    return $api.get<User>(`/users/${id}`);
  }

  static async updateProfile(id: string, data: UpdateProfileRequest): Promise<AxiosResponse<User>> {
    return $api.patch<User>(`/users/${id}`, data);
  }

  static async deleteUser(id: string): Promise<AxiosResponse<void>> {
    return $api.delete(`/users/${id}`);
  }

  static async searchUsers(query: string): Promise<AxiosResponse<User[]>> {
    return $api.get<User[]>('/users/search', { params: { q: query } });
  }
}