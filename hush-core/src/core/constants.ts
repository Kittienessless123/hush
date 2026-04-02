// Protocol
export const PROTOCOL_VERSION = 3;
export const SIGNAL_VERSION = [0x03] as const;

// Key lengths
export const KEY_LENGTH = 32; // X25519, AES-256, HKDF
export const MAC_LENGTH = 16; // AES-GCM tag
export const IV_LENGTH = 12; // AES-GCM nonce
export const SIGNATURE_LENGTH = 64; // Ed25519

// Limits
export const MAX_SKIPPED_KEYS = 2000;
export const MAX_MESSAGE_AGE_DAYS = 30;
export const MAX_PREKEY_ID = 0x7fffffff;

// Info strings for HKDF (Signal спецификация)
export const HKDF_INFO = {
  MESSAGE_KEY: 'WhisperMessageKeys',
  CHAIN_KEY: 'ChainKey',
  RATCHET: 'WhisperRatchet',
  X3DH: 'WhisperText',
  PREKEY_BUNDLE: 'WhisperPreKey',
} as const;

// Message types (для protobuf)
export enum CiphertextMessageType {
  WHISPER_TYPE = 1,
  PREKEY_TYPE = 3,
  SENDER_KEY_TYPE = 4, // Не используем в первой версии
  PLAINTEXT_TYPE = 5,
}

// Errors
export const ERROR_CODES = {
  SESSION_NOT_FOUND: 'ERR_SESSION_NOT_FOUND',
  INVALID_KEY: 'ERR_INVALID_KEY',
  UNTRUSTED_IDENTITY: 'ERR_UNTRUSTED_IDENTITY',
  DUPLICATE_MESSAGE: 'ERR_DUPLICATE_MESSAGE',
  STALE_MESSAGE: 'ERR_STALE_MESSAGE',
  PREKEY_NOT_FOUND: 'ERR_PREKEY_NOT_FOUND',
} as const;
