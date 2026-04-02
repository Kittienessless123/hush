// Единый экспорт всех ошибок

export { HushError } from './base.error';
export type { ErrorCode } from './base.error';

export { CryptoError, InvalidKeyError, SignatureVerificationFailedError } from './crypto.error';

export {
  SessionError,
  SessionNotFoundError,
  SessionCorruptedError,
  DuplicateMessageError,
  StaleMessageError,
  MessageSkippedTooManyError,
} from './session.error';

export { IdentityError, UntrustedIdentityError, IdentityKeyMismatchError } from './identity.error';

export {
  PreKeyError,
  PreKeyNotFoundError,
  NoPreKeysAvailableError,
  SignedPreKeyExpiredError,
} from './prekey.error';

export {
  ValidationError,
  InvalidMessageTypeError,
  InvalidProtocolVersionError,
} from './validation.error';

export { StorageError, SerializationError } from './storage.error';
