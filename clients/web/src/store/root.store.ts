import { createContext, useContext } from 'react';
import { AuthStore } from './auth.store';
import { ChatStore } from './chat.store';

export class RootStore {
  authStore: AuthStore;
  chatStore: ChatStore;

  constructor() {
    this.authStore = new AuthStore();
    this.chatStore = new ChatStore();
  }
}

// Создаем единственный экземпляр (синглтон)
export const rootStore = new RootStore();

// Контекст для React
export const StoreContext = createContext(rootStore);

// Хук для использования стора в компонентах
export const useStore = () => useContext(StoreContext);