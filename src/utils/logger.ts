type LogLevel = 'info' | 'warn' | 'error';

function log(level: LogLevel, message: string, data?: unknown) {
  if (!import.meta.env.DEV) return;
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] ${level.toUpperCase()}: ${message}`, data ?? '');
}

export const logger = {
  info: (message: string, data?: unknown) => log('info', message, data),
  warn: (message: string, data?: unknown) => log('warn', message, data),
  error: (message: string, data?: unknown) => log('error', message, data)
};
