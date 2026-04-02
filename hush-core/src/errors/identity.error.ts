// Ошибки identity ключей — требуют принятия решения

export class IdentityError extends HushError {
  readonly code = 'ERR_IDENTITY_FAILED';
}

export class UntrustedIdentityError extends IdentityError {
  readonly code = 'ERR_UNTRUSTED_IDENTITY';

  constructor(
    public readonly address: string,
    public readonly receivedKey: Uint8Array,
    public readonly expectedKey?: Uint8Array // если есть история
  ) {
    const expected = expectedKey ? 'does not match stored identity' : 'no trusted identity found';
    super(`Untrusted identity for ${address}: ${expected}`);
  }

  // Утилита для проверки: доверяем новый ключ?
  trustNewKey(): void {
    // Этот метод не в ошибке, а в вызывающем коде
  }
}

export class IdentityKeyMismatchError extends IdentityError {
  readonly code = 'ERR_IDENTITY_KEY_MISMATCH';

  constructor(
    public readonly address: string,
    public readonly oldKeyFingerprint: string,
    public readonly newKeyFingerprint: string
  ) {
    super(`Identity key changed for ${address}: ${oldKeyFingerprint} → ${newKeyFingerprint}`);
  }
}
