// store/root.store.ts
import { createContext } from "react";
import { AuthStore } from "./auth.store";
import { UserStore } from "./user.store";
import { SettingsStore } from "./SettingsStore";

export class RootStore {
  authStore: AuthStore;
  userStore: UserStore;
  settingsStore: SettingsStore;
  constructor() {
    this.authStore = new AuthStore();
    this.userStore = new UserStore();
    this.settingsStore = new SettingsStore();
  }
}

export const rootStore = new RootStore();
export const StoreContext = createContext<RootStore>(rootStore);
