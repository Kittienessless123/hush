import type { Message } from './api.types';

// REST запросы
export interface SendMessageRequest {
  content: string;
  file?: File;
}

export interface GetMessagesParams {
  limit?: number;
  offset?: number;
  before?: string; // ID сообщения, до которого загружать (для пагинации)
}

// WebSocket события
export interface SocketMessageEvents {
  // Отправка сообщения
  'message:send': {
    chatId: string;
    content: string;
    tempId?: string; // временный ID для оптимистичных обновлений
  };
  
  'message:send:ack': {
    tempId: string;
    message: Message;
  };

  // Редактирование
  'message:edit': {
    messageId: string;
    content: string;
  };
  
  'message:edit:ack': Message;

  // Удаление
  'message:delete': {
    messageId: string;
  };
  
  'message:delete:ack': {
    messageId: string;
    chatId: string;
  };

  // Прочтение
  'message:read': {
    chatId: string;
    messageId: string;
  };
  
  'message:read:ack': {
    messageId: string;
    userId: string;
    chatId: string;
  };

  // Новые сообщения (от сервера)
  'message:new': Message;
  'message:updated': Message;
  'message:deleted': {
    messageId: string;
    chatId: string;
  };
}

// Статус печатания
export interface TypingEvents {
  'user:typing': {
    chatId: string;
    isTyping: boolean;
  };
  
  'user:typing:notification': {
    userId: string;
    chatId: string;
    isTyping: boolean;
  };
}