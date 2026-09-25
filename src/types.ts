export interface NormalizedArgs {
  named: { key: string; value: string }[];
  positionals: string[];
}

export type ArgumentType = string | number | boolean;
export type Arguments = Record<string, ArgumentConfig<ArgumentType, boolean>>;
interface TypeMap {
  string: string;
  integer: number;
  float: number;
  boolean: boolean;
}

export type ArgumentConfig<T extends ArgumentType, Nullable extends boolean> = {
  description: string;
  // save type as string for parsing but also as a generic for typed 'default' property
  type: T extends string ? 'string' : T extends number ? 'integer' | 'float' : T extends boolean ? 'boolean' : never;
  // if nullable and not required, the default property can be set to null
  nullable?: Nullable | undefined; // default depends on required - if required, by default non-nullable
  positional?: boolean | undefined; // default false
  shortForm?: string | undefined;
} & (
  | {
      required: true; // default false
      defaultValue?: never | undefined;
    }
  | (Nullable extends true
      ? {
          required?: false | undefined; // default false
          defaultValue?: T | null | undefined; // default null
        }
      : {
          required?: false | undefined;
          defaultValue: T;
        })
);

// extract runtime argument type from type property on argument
type ArgumentValue<V> = V extends { type: infer T_Lit }
  ? (T_Lit extends keyof TypeMap ? TypeMap[T_Lit] : never) extends infer Resolved
    ? V extends { nullable: false } | { required: true; nullable?: false | undefined } | { defaultValue: Resolved }
      ? Resolved
      : Resolved | null
    : never
  : never;

// Transform a record of arguments into a dictionary
export type ArgumentsDictionary<T extends Arguments> = {
  [K in keyof T]: ArgumentValue<T[K]>;
};

// Fill in defaults for the argument definition
/*type ArgumentDefaults<T extends ArgumentType, Nullable> = {
  positional: false;  // Default: false
  nullable: Nullable; // Default: true
}
  & Pick<ArgumentConfig<T, Nullable>, 'description' | 'type'>
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
    T[K] extends ArgumentConfig<infer U, boolean> ? U : never,
    T[K] extends ArgumentConfig<ArgumentType, infer N> ? N : true
  >;
};*/

export type Module<T extends Arguments | undefined> = {
  fullName: string;
  description: string;
  examples: string | string[];
} & (
  | {
      arguments: Exclude<T, undefined>;
      run: (args: ArgumentsDictionary<Exclude<T, undefined>>) => Promise<number> | number;
    }
  | {
      arguments: undefined;
      run: () => Promise<number> | number;
    }
);
