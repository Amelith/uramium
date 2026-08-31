export type Argument<T extends string | number | boolean, Nullable = true> = {
  description: string;
  nullable?: Nullable;
  type: T extends string
    ? "string"
    : T extends number
      ? "number"
      : T extends boolean
        ? "boolean"
        : never;
} & (
  | {
      required: true;
      default?: never;
    }
  | {
      required?: false;
      default?: Nullable extends true ? T | null : T;
    }
);

export interface Module<T extends Record<string, Argument<never>> | undefined = Record<string, Argument<never>>> {
  name: string;
  description: string;
  arguments: T;
  run: ((args: T) => number);
}
