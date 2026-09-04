import type { Arguments, Module } from '../types.ts';

export function defineModule<T extends Arguments>(config: Module<T>): Module<T> {
  return config;
}
