import type { Message, Chat } from './api.types';

// ========== СОБЫТИЯ ==========

// События, которые клиент отправляет серверу
export interface ClientToServerEvents {
  // Сообщения
  'message:send': (payload: MessageSendPayload) => void;
  'message:edit': (payload: MessageEditPayload) => void;
  'message:delete': (payload: MessageDeletePayload) => void;
  'message:read': (payload: MessageReadPayload) => void;
  
  // Пользователи
  'user:typing': (payload: UserTypingPayload) => void;
  'user:online': () => void;
  
  // Чаты
  'chat:join': (chatId: string) => void;
  'chat:leave': (chatId: string) => void;
}

// События, которые сервер отправляет клиенту
export interface ServerToClientEvents {
  // Сообщения
  'message:new': (message: Message) => void;
  'message:updated': (message: Message) => void;
  'message:deleted': (payload: MessageDeletedPayload) => void;
  'message:read': (payload: MessageReadReceiptPayload) => void;
  'message:send:ack': (payload: MessageSendAckPayload) => void;
  'message:edit:ack': (message: Message) => void;
  'message:delete:ack': (payload: MessageDeletedPayload) => void;
  'message:read:ack': (payload: MessageReadReceiptPayload) => void;
  
  // Пользователи
  'user:typing': (payload: UserTypingNotificationPayload) => void;
  'user:online': (payload: UserOnlinePayload) => void;
  
  // Чаты
  'chat:created': (chat: Chat) => void;
  'chat:deleted': (payload: ChatDeletedPayload) => void;
  
  // Ошибки
  'error': (payload: ErrorPayload) => void;
}

// ========== PAYLOADS ==========

// Сообщения
export interface MessageSendPayload {
  chatId: string;
  content: string;
  tempId?: string;
}

export interface MessageSendAckPayload {
  tempId: string;
  message: Message;
}

export interface MessageEditPayload {
  messageId: string;
  content: string;
}

export interface MessageDeletePayload {
  messageId: string;
}

export interface MessageDeletedPayload {
  messageId: string;
  chatId: string;
}

export interface MessageReadPayload {
  chatId: string;
  messageId: string;
}

export interface MessageReadReceiptPayload {
  messageId: string;
  userId: string;
  chatId: string;
}

// Пользователи
export interface UserTypingPayload {
  chatId: string;
  isTyping: boolean;
}

export interface UserTypingNotificationPayload {
  userId: string;
  chatId: string;
  isTyping: boolean;
}

export interface UserOnlinePayload {
  userId: string;
  online: boolean;
  lastSeen?: string;
}

// Чаты
export interface ChatDeletedPayload {
  chatId: string;
}

// Ошибки
export interface ErrorPayload {
  message: string;
  code: string;
}