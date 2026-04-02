// Ошибки сессий — некоторые ожидаемые

export class SessionError extends HushError {
  readonly code = 'ERR_SESSION_FAILED';
}

export class SessionNotFoundError extends SessionError {
  readonly code = 'ERR_SESSION_NOT_FOUND';

  constructor(public readonly address: string) {
    super(`No session found for address: ${address}`);
  }
}

export class SessionCorruptedError extends SessionError {
  readonly code = 'ERR_SESSION_CORRUPTED';

  constructor(
    public readonly address: string,
    reason: string // 'invalid protobuf', 'missing root key', 'inconsistent state'
  ) {
    super(`Session for ${address} is corrupted: ${reason}`);
  }
}

export class DuplicateMessageError extends SessionError {
  readonly code = 'ERR_DUPLICATE_MESSAGE';

  constructor(
    public readonly messageIndex: number,
    public readonly chainType: 'sending' | 'receiving'
  ) {
    super(`Duplicate message detected in ${chainType} chain at index ${messageIndex}`);
  }
}

export class StaleMessageError extends SessionError {
  readonly code = 'ERR_STALE_MESSAGE';

  constructor(
    public readonly messageAgeDays: number,
    public readonly maxAgeDays: number
  ) {
    super(`Message is ${messageAgeDays} days old, maximum is ${maxAgeDays}`);
  }
}

export class MessageSkippedTooManyError extends SessionError {
  readonly code = 'ERR_MESSAGE_SKIPPED_TOO_MANY';

  constructor(
    public readonly skippedCount: number,
    public readonly maxAllowed: number
  ) {
    super(`Skipped ${skippedCount} messages, exceeds limit of ${maxAllowed}`);
  }
}
