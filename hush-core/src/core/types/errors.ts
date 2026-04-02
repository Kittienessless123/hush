// Псевдокод — напишите сами

export type ErrorCode = 
  | 'ERR_CRYPTO_FAILED'
  | 'ERR_INVALID_KEY'
  | 'ERR_SESSION_NOT_FOUND'
  | 'ERR_SESSION_CORRUPTED'
  | 'ERR_UNTRUSTED_IDENTITY'
  | 'ERR_IDENTITY_KEY_MISMATCH'
  | 'ERR_PREKEY_NOT_FOUND'
  | 'ERR_NO_PREKEYS_AVAILABLE'
  | 'ERR_SIGNATURE_VERIFICATION_FAILED'
  | 'ERR_DUPLICATE_MESSAGE'
  | 'ERR_STALE_MESSAGE'
  | 'ERR_MESSAGE_SKIPPED_TOO_MANY'
  | 'ERR_INVALID_MESSAGE_TYPE'
  | 'ERR_INVALID_PROTOCOL_VERSION'
  | 'ERR_SERIALIZATION_FAILED'
  | 'ERR_STORAGE_FAILED'

export abstract class HushError extends Error {
  abstract readonly code: ErrorCode
  
  constructor(
    message: string,
    public readonly cause?: Error  // Опциональная причина (например, ошибка IndexedDB)
  ) {
    super(message)
    this.name = this.constructor.name
    // Важно: сохранить stack trace
    Error.captureStackTrace?.(this, this.constructor)
  }
  
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      cause: this.cause?.message
    }
  }
}