import type { Arguments, Module } from '../types.ts';

export function defineModule<T extends Arguments>(config: Module<T>): Module<T> {
  return config;
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function indentAllButFirstLine(str: string, indentAmount = 2): string {
  const [first, ...rest] = str.split('\n');
  if (rest.length === 0) return first ?? '';

  const indentedRest = rest.map((line) => ' '.repeat(indentAmount) + line).join('\n');
  return `${first}\n${indentedRest}`;
}

export function attempt<T>(fn: () => T, defaultValue?: undefined): T | undefined;
//export function attempt<T>(fn: () => T): T | undefined;
export function attempt<T>(fn: () => T, defaultValue: T): T;
export function attempt<T>(fn: () => T, defaultValue?: T): T | undefined {
  try {
    return fn();
  } catch (_) {
    return defaultValue;
  }
}
