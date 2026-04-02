import { HushLogger, NoOpLogger } from './logging'
import { SignalProtocolStore } from './core/interfaces'
import { SessionBuilder } from './protocol/session/session-builder'
import { SessionCipher } from './protocol/session/session-cipher'

export interface HushCryptoConfig {
  store: SignalProtocolStore      // обязательное хранилище
  logger?: Logger                  // опционально
  maxSkippedKeys?: number          // override констант
  strictKeyValidation?: boolean    // проверять low-order точки
}

export class HushCrypto {
  private logger: Logger
  private store: SignalProtocolStore
  private config: Required<HushCryptoConfig>
  
  constructor(config: HushCryptoConfig) {
    // Валидация: store обязателен
    // Логгер: если нет - NoOpLogger
    // Конфиг: merge с дефолтами из constants
  }
  
  // === Для Bob (получатель) ===
  
  async generatePreKeys(startId: number, count: number): Promise<PreKey[]> {
    // Генерация count PreKey'ей начиная с startId
    // Сохранение в store
    // Логирование: info('Generated X prekeys')
  }
  
  async generateSignedPreKey(identityKey: IdentityKeyPair, id: number): Promise<SignedPreKey> {
    // Генерация новой SignedPreKey
    // Подпись identityKey'ом
    // Сохранение в store как current
  }
  
  async getPreKeyBundle(address: string): Promise<PreKeyBundle> {
    // Получить текущий SignedPreKey и один PreKey из пула
    // Не удалять PreKey из хранилища (сервер хранит копию)
  }
  
  // === Для Alice (инициатор) ===
  
  async initiateSession(address: string, bundle: PreKeyBundle): Promise<void> {
    // SessionBuilder.processPreKeyBundle
  }
  
  // === Шифрование/дешифрование ===
  
  async encrypt(address: string, plaintext: Uint8Array): Promise<CiphertextMessage> {
    // SessionCipher.encrypt
  }
  
  async decrypt(address: string, ciphertext: Uint8Array): Promise<Uint8Array> {
    // SessionCipher.decrypt
  }
  
  // === Управление сессиями ===
  
  async getSessionState(address: string): Promise<SessionState | null>
  async deleteSession(address: string): Promise<void>
  
  // === Identity management ===
  
  async trustIdentity(address: string, identityKey: IdentityKey): Promise<void>
  async getIdentityHistory(address: string): Promise<IdentityKey[]>
}