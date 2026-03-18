import { socketService } from './socket.config';
import type { Message } from '../../types/api.types';
import type { 
  MessageSendPayload,
  MessageEditPayload,
  MessageDeletePayload,
  MessageReadPayload,
  UserTypingPayload,
  MessageSendAckPayload,
  MessageDeletedPayload,
  MessageReadReceiptPayload,
  UserTypingNotificationPayload,
} from '../../types/socket.types';

class MessageSocketService {
  // ========== EMITTERS (типизированные) ==========
  
  sendMessage(payload: MessageSendPayload): void {
    socketService.sendMessage(payload);
  }

  editMessage(payload: MessageEditPayload): void {
    socketService.editMessage(payload);
  }

  deleteMessage(payload: MessageDeletePayload): void {
    socketService.deleteMessage(payload);
  }

  markAsRead(payload: MessageReadPayload): void {
    socketService.markAsRead(payload);
  }

  sendTyping(payload: UserTypingPayload): void {
    socketService.sendTyping(payload);
  }

  // ========== LISTENERS (типизированные) ==========
  
  onNewMessage(callback: (message: Message) => void): void {
    socketService.onNewMessage(callback);
  }

  onMessageUpdated(callback: (message: Message) => void): void {
    socketService.onMessageUpdated(callback);
  }

  onMessageDeleted(callback: (payload: MessageDeletedPayload) => void): void {
    socketService.onMessageDeleted(callback);
  }

  onMessageSentAck(callback: (payload: MessageSendAckPayload) => void): void {
    socketService.on('message:send:ack', callback);
  }

  onMessageRead(callback: (payload: MessageReadReceiptPayload) => void): void {
    socketService.onMessageRead(callback);
  }

  onUserTyping(callback: (payload: UserTypingNotificationPayload) => void): void {
    socketService.onUserTyping(callback);
  }

  
  removeAllListeners(): void {
    socketService.off('message:new');
    socketService.off('message:updated');
    socketService.off('message:deleted');
    socketService.off('message:read');
    socketService.off('user:typing');
    socketService.off('message:send:ack');
  }
}

export const messageSocket = new MessageSocketService();