// Ошибки PreKey — обычно означают проблемы с сервером

import { HushError } from "../core/types/errors"

export class PreKeyError extends HushError {
  readonly code = 'ERR_PREKEY_FAILED'
}

export class PreKeyNotFoundError extends PreKeyError {
  readonly code = 'ERR_PREKEY_NOT_FOUND'
  
  constructor(public readonly preKeyId: number) {
    super(`PreKey with id ${preKeyId} not found in local storage`)
  }
}

export class NoPreKeysAvailableError extends PreKeyError {
  readonly code = 'ERR_NO_PREKEYS_AVAILABLE'
  
  constructor() {
    super('No one-time prekeys available. Generate more.')
  }
}

export class SignedPreKeyExpiredError extends PreKeyError {
  readonly code = 'ERR_SIGNED_PREKEY_EXPIRED'
  
  constructor(
    public readonly signedPreKeyId: number,
    public readonly expiredAt: Date
  ) {
    super(`SignedPreKey ${signedPreKeyId} expired at ${expiredAt.toISOString()}`)
  }
}