import { useContext } from 'react';
import { StoreContext, type RootStore} from '../store/root.store';

export const useStore = (): RootStore => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return store;
};

// Для удобства можно создать отдельные хуки
export const useAuthStore = () => useStore().authStore;