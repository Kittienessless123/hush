import type { Message } from "./api.types";

export interface SendMessageRequest {
  content: string;
  file?: File;
}

export interface GetMessagesParams {
  limit?: number;
  offset?: number;
  before?: string;
}

export interface SocketMessageEvents {
  "message:send": {
    chatId: string;
    content: string;
    tempId?: string;
  };

  "message:send:ack": {
    tempId: string;
    message: Message;
  };

  "message:edit": {
    messageId: string;
    content: string;
  };

  "message:edit:ack": Message;

  "message:delete": {
    messageId: string;
  };

  "message:delete:ack": {
    messageId: string;
    chatId: string;
  };

  "message:read": {
    chatId: string;
    messageId: string;
  };

  "message:read:ack": {
    messageId: string;
    userId: string;
    chatId: string;
  };

  "message:new": Message;
  "message:updated": Message;
  "message:deleted": {
    messageId: string;
    chatId: string;
  };
}

export interface TypingEvents {
  "user:typing": {
    chatId: string;
    isTyping: boolean;
  };

  "user:typing:notification": {
    userId: string;
    chatId: string;
    isTyping: boolean;
  };
}
