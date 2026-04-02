// Ошибки валидации входных данных

import { HushError } from "../core/types/errors"

export class ValidationError extends HushError {
  readonly code = 'ERR_VALIDATION_FAILED'
  
  constructor(
    field: string,
    expected: string,
    actual: any
  ) {
    super(`Invalid ${field}: expected ${expected}, got ${actual}`)
  }
}

export class InvalidMessageTypeError extends ValidationError {
  readonly code = 'ERR_INVALID_MESSAGE_TYPE'
  
  constructor(actualType: number) {
    super('message type', '1 (Whisper) or 3 (PreKey)', actualType)
  }
}

export class InvalidProtocolVersionError extends ValidationError {
  readonly code = 'ERR_INVALID_PROTOCOL_VERSION'
  
  constructor(actualVersion: number, expectedVersion: number) {
    super('protocol version', `${expectedVersion}`, actualVersion)
  }
}