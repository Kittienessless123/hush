/**
 * Состояние сессии - то, что сериализуется в protobuf
 */
type SessionState = {
  // Root chain
  rootKey: Uint8Array               // 32 bytes
  previousRootKey?: Uint8Array
  
  // Sender chain (для Alice или Bob в зависимости от роли)
  senderChain: {
    ratchetKey: Uint8Array          // наш ephemeral ключ
    chainKey: ChainKey              // текущий ChainKey
    messageKeys: Map<number, Uint8Array> // пропущенные индексы
  }
  
  // Receiver chains (ключ - publicKey отправителя)
  receiverChains: Map<string, {
    ratchetKey: Uint8Array
    chainKey: ChainKey
    messageKeys: Map<number, Uint8Array>
  }>
  
  // Информация о сессии
  localIdentityKey: Uint8Array
  remoteIdentityKey: Uint8Array
  remoteEphemeralKey?: Uint8Array   // последний полученный ephemeral
  
  // PreKey информация (если сессия начата с PreKey)
  pendingPreKeyId?: number
  pendingSignedPreKeyId?: number
  
  // Счётчики
  previousCounter: number           // для skip-ahead защиты
  version: number                   // 3 для Signal v3
  isAlice: boolean                  // true если мы инициировали сессию
}

type SessionRecord = {
  currentState: SessionState
  previousState?: SessionState      // для ratchet-rollback
  version: number
}