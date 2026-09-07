import type { Arguments, Module } from '../types.ts';

export function defineModule<T extends Arguments>(config: Module<T>): Module<T> {
  return config;
}

export function indentAllButFirstLine(str: string, indentAmount = 2): string {
  const [first, ...rest] = str.split('\n');
  if (rest.length === 0) return first ?? '';

  const indentedRest = rest.map((line) => ' '.repeat(indentAmount) + line).join('\n');
  return `${first}\n${indentedRest}`;
}
