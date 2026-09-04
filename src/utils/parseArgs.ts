import type { ArgumentConfig, ArgumentType, Arguments, ArgumentsDictionary, NormalizedArgs } from '../types.ts';

export function normalizeArgs(args: string[]): NormalizedArgs {
  const named: { key: string, value: string }[] = [];
  const positionals: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const a = args[i]!;
    if (a.includes('=')) {
      const [key, value] = a.split('=');

      if (!key) {
        throw new Error(`Key not found for provided value ${value}`)
      } else if (!value) {
        throw new Error(`Value not found for provided value ${key}`)
      } else {
        named.push({
          // remove leading - or --
          key: key?.replace(/^--?/, ''),
          value: value,
        });
      }
    } else {
      if (a.startsWith('-')) {
        const key = a.replace(/^--?/, '');
        if (!key) throw new Error('Invalid - / -- found in arguments');

        const value = args[++i];
        if (!value) throw new Error(`Value not found for key ${key}`);

        named.push({ key, value });
      } else {
        // if a is a value of a named argument (without =),
        // it's already been handled when the named argument was found
        positionals.push(a);
      }
    }
  }

  return { named, positionals };
}

export function parseArgs<T extends Arguments>(args: NormalizedArgs | string[], options: T): ArgumentsDictionary<T> {
  if (Array.isArray(args)) args = normalizeArgs(args);
  /*const { keys, values }: { keys: string[], values: string[] } = args.named.reduce((prev, curr) => {
    prev.keys.push(curr.key);
    prev.values.push(curr.value);
    return prev;
    }, ({ keys: [] as string[], values: [] as string[] }));*/

  const named = args.named;
  const positionals = args.positionals;

  const results: Record<string, string | number | boolean | null> = {};
  let currentPositionalIndex = 0;

  for (const [key, config] of Object.entries(options)) {
    const entry = named.find(e => e.key === key || e.key === config.shortForm)
    if (entry) {
      results[key] = parseType(key, entry.value, config);
      continue;
    } else {
      if (config.positional ?? false) {
        const positionalValue = positionals[currentPositionalIndex++];
        if (positionalValue) {
          results[key] = parseType(key, positionalValue, config);
          continue;
        }
        // positionalValue not found (not enough / none provided), so check if value is required
      }

      if (config.required ?? false) {
        throw new Error(`Argument ${key} of type ${config.type} required but not found (positional: ${config.positional ?? false})`);
      } else {
        if (config.default !== undefined) {
          results[key] = config.default; // default is already provided as the type required
        } else if (config.nullable) {
          results[key] = null;
        } else {
          throw new Error(`Invalid arguments config for ${key}: required false, default not provided, nullable false`)
        }
      }
    }
  }

  return results as ArgumentsDictionary<T>;
}

/*function parseType(value: string, config: ArgumentConfig<string, true>): string | null;
function parseType(value: string, config: ArgumentConfig<string, false>): string;
function parseType(value: string, config: ArgumentConfig<number, true>): number | null;
function parseType(value: string, config: ArgumentConfig<number, false>): number;
function parseType(value: string, config: ArgumentConfig<boolean, true>): boolean | null;
function parseType(value: string, config: ArgumentConfig<boolean, false>): boolean;*/
function parseType<T extends ArgumentType>(key: string, value: string, config: ArgumentConfig<T, boolean>): T | null {
  if (value === 'null' && (config.nullable ?? true)) return null;

  switch (config.type) {
    case 'string': return value as T;
    case 'integer': {
      const int = parseInt(value);
      if (isNaN(int)) throw new Error(`Could not parse value for ${key} as integer`);
      return int as T;
    }
    case 'float': {
      const float = parseFloat(value);
      if (isNaN(float)) throw new Error(`Could not parse value for ${key} as float`);
      return float as T;
    }
    case 'boolean': {
      if (value === 'true') return true as T;
      else if (value === 'false') return false as T;
      else throw new Error(`Could not parse value for ${key} as boolean`);
    }
  }
}
