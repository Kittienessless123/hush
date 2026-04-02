/**
 * Все методы асинхронные (Promise)
 */
interface SignalProtocolStore {
  // === Session management ===
  loadSession(address: string): Promise<SessionRecord | null>
  storeSession(address: string, record: SessionRecord): Promise<void>
  deleteSession(address: string): Promise<void>
  
  // === PreKeys (одноразовые) ===
  loadPreKey(preKeyId: number): Promise<PreKey | null>
  storePreKey(preKeyId: number, preKey: PreKey): Promise<void>
  removePreKey(preKeyId: number): Promise<void>
  
  // === Signed PreKeys (с поддержкой истории) ===
  loadSignedPreKey(signedPreKeyId: number): Promise<SignedPreKey | null>
  storeSignedPreKey(signedPreKeyId: number, signedPreKey: SignedPreKey): Promise<void>
  
  // Текущий активный SignedPreKey (для генерации новых)
  getCurrentSignedPreKey(): Promise<SignedPreKey | null>
  setCurrentSignedPreKey(signedPreKey: SignedPreKey): Promise<void>
  
  // === Identity keys (с историей) ===
  getIdentityKeyPair(): Promise<IdentityKeyPair>
  getLocalRegistrationId(): Promise<number>
  
  // Remote identity с историей
  getIdentity(address: string): Promise<IdentityKey | null>
  saveIdentity(address: string, identityKey: IdentityKey): Promise<boolean> // true если изменился
  
  // История identity ключей (для защиты от MITM)
  getIdentityHistory(address: string): Promise<IdentityKey[]>
  
  // === Registration ID ===
  getRemoteRegistrationId(address: string): Promise<number | null>
  saveRemoteRegistrationId(address: string, registrationId: number): Promise<void>
  
  // === Утилиты ===
  isTrustedIdentity(address: string, identityKey: IdentityKey): Promise<boolean>
}

interface IdentityKey {
  publicKey: Uint8Array
  timestamp: number
  trusted: boolean
}