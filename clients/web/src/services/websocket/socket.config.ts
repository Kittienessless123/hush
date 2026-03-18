/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '../../types/api.types';

const SOCKET_URL = import.meta.env.VITE_WS_URL || BASE_URL;

export class TypedSocketService {
  private socket: Socket | null = null; // Убираем типизацию Socket

  connect(token: string): void {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      withCredentials: true,
    });

    this.setupListeners();
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Socket connection error:', error.message);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // ========== EMITTERS ==========
  
  sendMessage(data: { chatId: string; content: string; tempId?: string }): void {
    this.socket?.emit('message:send', data);
  }

  editMessage(data: { messageId: string; content: string }): void {
    this.socket?.emit('message:edit', data);
  }

  deleteMessage(data: { messageId: string }): void {
    this.socket?.emit('message:delete', data);
  }

  markAsRead(data: { chatId: string; messageId: string }): void {
    this.socket?.emit('message:read', data);
  }

  sendTyping(data: { chatId: string; isTyping: boolean }): void {
    this.socket?.emit('user:typing', data);
  }

  joinChat(chatId: string): void {
    this.socket?.emit('chat:join', chatId);
  }

  leaveChat(chatId: string): void {
    this.socket?.emit('chat:leave', chatId);
  }

  // ========== LISTENERS ==========
  
  onNewMessage(callback: (data: any) => void): void {
    this.socket?.on('message:new', callback);
  }

  onMessageUpdated(callback: (data: any) => void): void {
    this.socket?.on('message:updated', callback);
  }

  onMessageDeleted(callback: (data: any) => void): void {
    this.socket?.on('message:deleted', callback);
  }

  onMessageRead(callback: (data: any) => void): void {
    this.socket?.on('message:read', callback);
  }

  onUserTyping(callback: (data: any) => void): void {
    this.socket?.on('user:typing', callback);
  }

  onUserOnline(callback: (data: any) => void): void {
    this.socket?.on('user:online', callback);
  }

  onChatCreated(callback: (data: any) => void): void {
    this.socket?.on('chat:created', callback);
  }

  onChatDeleted(callback: (data: any) => void): void {
    this.socket?.on('chat:deleted', callback);
  }

  onError(callback: (data: any) => void): void {
    this.socket?.on('error', callback);
  }

  // УНИВЕРСАЛЬНЫЙ МЕТОД для любых событий
  on(event: string, callback: (data: any) => void): void {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (data: any) => void): void {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }

  // ========== UTILS ==========

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

export const socketService = new TypedSocketService();