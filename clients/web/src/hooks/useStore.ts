// src/hooks/useStore.ts
import { useContext } from "react";
import { StoreContext, type RootStore } from "../store/root.store";

export const useStore = (): RootStore => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return store;
};

export const useAuthStore = () => useStore().authStore;
export const useUserStore = () => useStore().userStore;
export const useSettingsStore = () => useStore().settingsStore;
