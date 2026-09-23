const LOG_LEVEL = process.env['LOG_LEVEL']?.toUpperCase() ?? 'INFO';

const LOG_LEVELS = {
  OFF: 0,
  ERROR: 1,
  WARN: 2,
  LOG: 3,
  INFO: 4,
  DEBUG: 5,
  TRACE: 6,
}

const LOG_LEVEL_NUM = (LOG_LEVEL in LOG_LEVELS) ? LOG_LEVELS[LOG_LEVEL as keyof typeof LOG_LEVELS] : LOG_LEVELS.INFO;

export function trace(msg: unknown): void {
  if (LOG_LEVEL_NUM < LOG_LEVELS.TRACE) return;
  console.trace(msg);
}

export function debug(msg: unknown): void {
  if (LOG_LEVEL_NUM < LOG_LEVELS.DEBUG) return;
  console.debug(msg);
}

export function info(msg: unknown): void {
  if (LOG_LEVEL_NUM < LOG_LEVELS.INFO) return;
  console.info(msg);
}

export function log(msg: unknown): void {
  if (LOG_LEVEL_NUM < LOG_LEVELS.LOG) return;
  console.log(msg);
}

export function warn(msg: unknown): void {
  if (LOG_LEVEL_NUM < LOG_LEVELS.WARN) return;
  console.warn(msg);
}

export function error(msg: string, err: unknown): void {
  if (LOG_LEVEL_NUM < LOG_LEVELS.ERROR) return;
  console.error(msg, err);
}
