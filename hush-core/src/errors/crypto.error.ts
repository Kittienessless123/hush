// Криптографические ошибки — обычно фатальные

import { HushError } from "../core/types/errors"

export class CryptoError extends HushError {
  readonly code = 'ERR_CRYPTO_FAILED'
  
  constructor(
    operation: string,  // 'key generation', 'encrypt', 'decrypt', 'sign'
    cause?: Error
  ) {
    super(`Crypto operation failed: ${operation}`, cause)
  }
}

export class InvalidKeyError extends CryptoError {
  readonly code = 'ERR_INVALID_KEY'
  
  constructor(
    keyType: string,    // 'identity', 'prekey', 'ephemeral', 'message key'
    reason: string      // 'low-order point', 'wrong length', 'all zeros'
  ) {
    super(`Invalid ${keyType}: ${reason}`)
  }
}

export class SignatureVerificationFailedError extends CryptoError {
  readonly code = 'ERR_SIGNATURE_VERIFICATION_FAILED'
  
  constructor(public readonly signedPreKeyId: number) {
    super(`Signature verification failed for signed prekey ${signedPreKeyId}`)
  }
}