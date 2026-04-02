// Ошибки хранилища — оборачиваем нативные ошибки

import { HushError } from "../core/types/errors"

export class StorageError extends HushError {
  readonly code = 'ERR_STORAGE_FAILED'
  
  constructor(
    operation: string,  // 'open database', 'get item', 'put item'
    public readonly storeName?: string,
    cause?: Error
  ) {
    super(`Storage operation failed: ${operation}`, cause)
  }
}

export class SerializationError extends StorageError {
  readonly code = 'ERR_SERIALIZATION_FAILED'
  
  constructor(
    operation: 'serialize' | 'deserialize',
    type: 'SessionRecord' | 'PreKey' | 'IdentityKey',
    cause?: Error
  ) {
    super(`Failed to ${operation} ${type}`, undefined, cause)
  }
}