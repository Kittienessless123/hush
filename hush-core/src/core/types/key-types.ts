// Псевдокод - напишите реализацию сами

/**
 * Raw ключи - всегда Uint8Array фиксированной длины
 */
type IdentityKeyPair = {
  publicKey: Uint8Array  // 32 bytes
  privateKey: Uint8Array // 32 bytes
}

type PreKey = {
  id: number             // от 1 до 2^31
  keyPair: KeyPair       // X25519 ключи
}

type SignedPreKey = {
  id: number
  keyPair: KeyPair
  signature: Uint8Array  // Ed25519 подпись identityKey над publicKey
  timestamp: number      // Unix timestamp
}

type KeyPair = {
  publicKey: Uint8Array
  privateKey: Uint8Array
}

/**
 * PreKeyBundle - то, что приходит с сервера
 */
type PreKeyBundle = {
  identityKey: Uint8Array           // Bob's identity public
  preKeyId?: number                 // может быть null если нет одноразовых
  preKeyPublic?: Uint8Array
  signedPreKeyId: number
  signedPreKeyPublic: Uint8Array
  signedPreKeySignature: Uint8Array // Подпись identity над signedPreKey
  registrationId: number            // 0..16383
}