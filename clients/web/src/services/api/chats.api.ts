import type { AxiosResponse } from 'axios';
import { $api } from './axios.config';
import type { 
  Chat, 
  CreateChatRequest,
  Message
} from '../../types/api.types';

export class ChatService {
  static async getChats(): Promise<AxiosResponse<Chat[]>> {
    return $api.get<Chat[]>('/chats');
  }

  static async getChatById(id: string): Promise<AxiosResponse<Chat>> {
    return $api.get<Chat>(`/chats/${id}`);
  }

  static async createChat(data: CreateChatRequest): Promise<AxiosResponse<Chat>> {
    return $api.post<Chat>('/chats', data);
  }

  static async deleteChat(id: string): Promise<AxiosResponse<void>> {
    return $api.delete(`/chats/${id}`);
  }

  static async getChatMessages(
    chatId: string, 
    params?: { limit?: number; offset?: number }
  ): Promise<AxiosResponse<Message[]>> {
    return $api.get<Message[]>(`/chats/${chatId}/messages`, { params });
  }
}