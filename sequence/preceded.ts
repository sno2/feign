import type { EvalUtility, Parser, Utility } from "../utilities.ts";

export type PrecededHelper<
  Init extends {
    input: string;
    first: Utility;
    second: Utility;
  },
> = string extends Init["input"]
  ? readonly [string, EvalUtility<Init["second"], string>[1]]
  : EvalUtility<Init["first"], Init["input"]> extends infer $Data
    ? [$Data] extends [never] ? never
    : $Data extends readonly [infer $Input, any]
      ? $Input extends string
        ? EvalUtility<Init["second"], $Input> extends infer $Data
          ? [$Data] extends [never] ? never
          : $Data extends readonly [infer $Input, infer $Result]
            ? readonly [$Input, $Result]
          : never
        : never
      : never
    : never
  : never;

export class Preceded<
  First extends Utility,
  Second extends Utility,
> implements Parser {
  key = "preceded" as const;
  readonly first: First;
  readonly second: Second;

  constructor(first: First, second: Second) {
    this.first = first;
    this.second = second;
  }

  parse<
    I extends string,
  >(
    input_: I,
  ): PrecededHelper<{ first: First; second: Second; input: I }> {
    const [input, _] = (this.first.parse as any)(input_);
    return (this.second.parse as any)(input);
  }
}

export function preceded<First extends Utility, Second extends Utility>(
  first: First,
  second: Second,
): Preceded<First, Second> {
  return new Preceded(first, second);
}
