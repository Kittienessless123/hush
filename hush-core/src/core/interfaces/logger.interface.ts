type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogContext = {
  sessionId?: string;
  messageId?: string;
  [key: string]: any;
};

interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;

  // Для производительности
  shouldLog(level: LogLevel): boolean;
}

// Конфигурация логгера
type LoggerConfig = {
  level: LogLevel;
  enableTimestamps: boolean;
  prefix?: string;

};
