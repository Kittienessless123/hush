import { makeAutoObservable, runInAction } from 'mobx';
import type { Message, Chat } from '../types/api.types';
import { MessageService } from '../services/api/messages.api';
import { messageSocket } from '../services/websocket/messages.socket';
import { ChatService } from '../services/api/chats.api';

export class ChatStore {
  // ========== STATE ==========
  messages: Message[] = [];
  currentChat: Chat | null = null;
  chats: Chat[] = [];
  isLoading = false;
  error: string | null = null;
  typingUsers: Map<string, Set<string>> = new Map(); // chatId -> Set<userId>

  constructor() {
    makeAutoObservable(this);
  }

  // ========== ACTIONS (меняют состояние) ==========
  
  setMessages(messages: Message[]) {
    this.messages = messages;
  }

  addMessage(message: Message) {
    this.messages.push(message);
  }

  updateMessage(updatedMessage: Message) {
    const index = this.messages.findIndex(m => m.id === updatedMessage.id);
    if (index !== -1) {
      this.messages[index] = updatedMessage;
    }
  }

  removeMessage(messageId: string) {
    this.messages = this.messages.filter(m => m.id !== messageId);
  }

  setCurrentChat(chat: Chat | null) {
    this.currentChat = chat;
  }

  setChats(chats: Chat[]) {
    this.chats = chats;
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setUserTyping(chatId: string, userId: string, isTyping: boolean) {
    if (!this.typingUsers.has(chatId)) {
      this.typingUsers.set(chatId, new Set());
    }
    
    const users = this.typingUsers.get(chatId)!;
    if (isTyping) {
      users.add(userId);
    } else {
      users.delete(userId);
    }
  }

  clearTyping(chatId: string) {
    this.typingUsers.delete(chatId);
  }

  // ========== ASYNC ACTIONS ==========
  
  async loadChats() {
    this.setLoading(true);
    try {
      const response = await ChatService.getChats();
      runInAction(() => {
        this.chats = response.data;
        this.setLoading(false);
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to load chats';
        this.setLoading(false);
      });
    }
  }

  async loadMessages(chatId: string) {
    this.setLoading(true);
    try {
      const response = await MessageService.getMessages(chatId);
      runInAction(() => {
        this.messages = response.data;
        this.setLoading(false);
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to load messages';
        this.setLoading(false);
      });
    }
  }

  async sendMessage(chatId: string, content: string) {
    const tempId = `temp-${Date.now()}`;
    
    // Оптимистичное обновление
    const tempMessage: Message = {
      id: tempId,
      chatId,
      senderId: 'current-user', // заменится на реальный
      content,
      encrypted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.addMessage(tempMessage);
    
    // Отправка через сокет
    messageSocket.sendMessage({ chatId, content, tempId });
  }

  // ========== COMPUTED (производные данные) ==========
  
  get unreadCount(): number {
    return this.messages.filter(m => !m.read).length;
  }

  get lastMessage(): Message | null {
    return this.messages.length > 0 
      ? this.messages[this.messages.length - 1] 
      : null;
  }

  get messagesByDate(): Map<string, Message[]> {
    const grouped = new Map<string, Message[]>();
    
    this.messages.forEach(message => {
      const date = new Date(message.createdAt).toLocaleDateString();
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)!.push(message);
    });
    
    return grouped;
  }

  isUserTyping(chatId: string, userId: string): boolean {
    return this.typingUsers.get(chatId)?.has(userId) || false;
  }

  get typingText(): string {
    if (!this.currentChat) return '';
    
    const typing = this.typingUsers.get(this.currentChat.id);
    if (!typing || typing.size === 0) return '';
    
    if (typing.size === 1) {
      return `${Array.from(typing)[0]} печатает...`;
    }
    return `${typing.size} человек печатают...`;
  }
}