const LOG_LEVEL = process.env['LOG_LEVEL']?.toUpperCase() ?? 'INFO';

const LOG_LEVELS = {
  off: 0,
  error: 1,
  warn: 2,
  log: 3,
  info: 4,
  debug: 5,
  trace: 6,
}

const LOG_LEVEL_NUM = (LOG_LEVEL in LOG_LEVELS) ? LOG_LEVELS[LOG_LEVEL as keyof typeof LOG_LEVELS] : LOG_LEVELS.info;

export function trace(msg: unknown): void {
  if (LOG_LEVEL_NUM < LOG_LEVELS.trace) return;
  console.trace(msg);
}

export function debug(msg: unknown): void {
  if (LOG_LEVEL_NUM < LOG_LEVELS.debug) return;
  console.debug(msg);
}

export function info(msg: unknown): void {
  if (LOG_LEVEL_NUM < LOG_LEVELS.info) return;
  console.info(msg);
}

export function log(msg: unknown): void {
  if (LOG_LEVEL_NUM < LOG_LEVELS.log) return;
  console.log(msg);
}

export function warn(msg: unknown): void {
  if (LOG_LEVEL_NUM < LOG_LEVELS.warn) return;
  console.warn(msg);
}

export function error(msg: string, err: unknown): void {
  if (LOG_LEVEL_NUM < LOG_LEVELS.error) return;
  console.error(msg, err);
}
