export interface NormalizedArgs {
  named: { key: string, value: string }[];
  positionals: string[];
}

export type ArgumentType = string | number | boolean;

export type ArgumentConfig<T extends ArgumentType, Nullable> = {
  positional?: boolean; // default false
  shortForm?: string;
  description: string;
  // if nullable and not required, the default property can be set to null
  nullable?: Nullable; // default true
  // save type as string for parsing but also as a generic for typed 'default' property
  type: T extends string
  ? 'string'
  : T extends number
  ? 'integer' | 'float'
  : T extends boolean
  ? 'boolean'
  : never;
} & (
    | {
      required: true; // default false
      default?: never;
    }
    | (
      Nullable extends true
      ? {
        required?: false; // default false
        default?: T | null; // default null
      }
      : {
        required?: false;
        default: T
      }
    )
  );

type ArgumentValue<T> =
  T extends ArgumentConfig<infer U, infer N>
  ? T extends { required: true }
  ? U  // Required
  : N extends true
  ? U | null  // Optional + nullable
  : U  // Optional + not nullable
  : never;

// Transform a record of arguments into a dictionary
export type ArgumentsDictionary<T extends Arguments> = {
  [K in keyof T]: ArgumentValue<T[K]>;
};

export type Arguments = Record<string, ArgumentConfig<ArgumentType, boolean>>;

/*// Fill in defaults for the argument definition
type ArgumentDefaults<T extends ArgumentType, Nullable = true> = {
  positional: false;  // Default: false
  nullable: Nullable; // Default: true
}
  & Pick<Argument<T, Nullable>, 'description' | 'type'>
  & (
    | {
      required: true;
      default?: never;
    }
    | Nullable extends true
    ? {
      required?: false;
      default?: T | null;
    }
    : {
      required?: false;
      default: T
    }
  );

// Transform a record of arguments
type FilledArguments<T extends Arguments> = {
  [K in keyof T]: ArgumentDefaults<
    T[K] extends Argument<infer U> ? U : never,
    T[K] extends Argument<ArgumentType, infer N> ? N : true
  >;
};*/

export type Module<T extends Arguments | undefined> = {
  fullName: string;
  description: string;
  examples: string | string[];
} & ({
  arguments: Exclude<T, undefined>;
  run: (args: ArgumentsDictionary<Exclude<T, undefined>>) => number;
} | {
  arguments: undefined;
  run: () => number;
});
