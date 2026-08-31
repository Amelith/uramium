import type { Module, Argument } from "../types.ts";

export function defineModule<T extends Record<string, Argument<never>> | undefined>(config: Module<T>) {
  return config;
}
