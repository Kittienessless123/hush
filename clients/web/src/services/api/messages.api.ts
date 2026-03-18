import type { AxiosResponse } from 'axios';
import { $api } from './axios.config.ts';
import type { Message } from '../../types/api.types.ts';
import type { SendMessageRequest, GetMessagesParams } from '../../types/message.types';

export class MessageService {
  /**
   * REST: Получить историю сообщений чата
   * GET /chats/:chatId/messages?limit=50&offset=0
   * 
   * Используется при:
   * - Открытии чата
   * - Ленивой загрузке истории (скролл вверх)
   */
  static async getMessages(
    chatId: string,
    params?: GetMessagesParams
  ): Promise<AxiosResponse<Message[]>> {
    return $api.get<Message[]>(`/chats/${chatId}/messages`, { 
      params: {
        limit: params?.limit || 50,
        offset: params?.offset || 0,
        before: params?.before,
      } 
    });
  }

  /**
   * REST: Отправить сообщение с файлом
   * POST /chats/:chatId/messages
   * 
   * Используется ТОЛЬКО для сообщений с файлами,
   * для текста используем WebSocket
   */
  static async sendMessageWithFile(
    chatId: string,
    data: SendMessageRequest
  ): Promise<AxiosResponse<Message>> {
    if (!data.file) {
      throw new Error('File is required for this method');
    }

    const formData = new FormData();
    formData.append('content', data.content || '');
    formData.append('file', data.file);
    
    return $api.post<Message>(`/chats/${chatId}/messages`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * REST: Получить одно сообщение по ID
   * GET /messages/:id
   */
  static async getMessageById(id: string): Promise<AxiosResponse<Message>> {
    return $api.get<Message>(`/messages/${id}`);
  }

  /**
   * REST: Редактировать сообщение
   * PATCH /messages/:id
   * 
   * Для текста используем WebSocket, этот метод - запасной вариант
   */
  static async editMessage(
    id: string, 
    content: string
  ): Promise<AxiosResponse<Message>> {
    return $api.patch<Message>(`/messages/${id}`, { content });
  }

  /**
   * REST: Удалить сообщение
   * DELETE /messages/:id
   * 
   * Для быстрого удаления используем WebSocket,
   * этот метод - для синхронизации
   */
  static async deleteMessage(id: string): Promise<AxiosResponse<void>> {
    return $api.delete(`/messages/${id}`);
  }

  /**
   * REST: Пометить сообщения как прочитанные
   * POST /chats/:chatId/read
   */
  static async markAsRead(
    chatId: string,
    messageId: string
  ): Promise<AxiosResponse<void>> {
    return $api.post(`/chats/${chatId}/read`, { messageId });
  }
}