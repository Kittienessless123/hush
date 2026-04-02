// src/storage/in-memory/in-memory-store.ts

class InMemorySignalProtocolStore implements SignalProtocolStore {
  // Приватные Map для каждого типа данных
  private sessions: Map<string, SessionRecord>;
  private preKeys: Map<number, PreKey>;
  private signedPreKeys: Map<number, SignedPreKey>;
  private currentSignedPreKeyId: number | null;
  private identityKeys: Map<string, IdentityKey[]>; // история
  private registrationIds: Map<string, number>;

  constructor() {
    // Инициализация Map'ов
  }
  storeSession(address: string, record: SessionRecord): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteSession(address: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  loadPreKey(preKeyId: number): Promise<PreKey | null> {
    throw new Error("Method not implemented.");
  }
  storePreKey(preKeyId: number, preKey: PreKey): Promise<void> {
    throw new Error("Method not implemented.");
  }
  removePreKey(preKeyId: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  loadSignedPreKey(signedPreKeyId: number): Promise<SignedPreKey | null> {
    throw new Error("Method not implemented.");
  }
  storeSignedPreKey(signedPreKeyId: number, signedPreKey: SignedPreKey): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getCurrentSignedPreKey(): Promise<SignedPreKey | null> {
    throw new Error("Method not implemented.");
  }
  setCurrentSignedPreKey(signedPreKey: SignedPreKey): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getIdentityKeyPair(): Promise<IdentityKeyPair> {
    throw new Error("Method not implemented.");
  }
  getLocalRegistrationId(): Promise<number> {
    throw new Error("Method not implemented.");
  }
  getIdentity(address: string): Promise<IdentityKey | null> {
    throw new Error("Method not implemented.");
  }
  saveIdentity(address: string, identityKey: IdentityKey): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getIdentityHistory(address: string): Promise<IdentityKey[]> {
    throw new Error("Method not implemented.");
  }
  getRemoteRegistrationId(address: string): Promise<number | null> {
    throw new Error("Method not implemented.");
  }
  saveRemoteRegistrationId(address: string, registrationId: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  isTrustedIdentity(address: string, identityKey: IdentityKey): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  // Все методы - async, но мгновенные (Promise.resolve)
  async loadSession(address: string): Promise<SessionRecord | null> {
    // return this.sessions.get(address) || null
  }

  // ... остальные методы
}
