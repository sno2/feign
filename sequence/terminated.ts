import type { EvalUtility, Parser, Utility } from "../utilities.ts";

export type TerminatedHelper<
  Init extends {
    input: string;
    first: Utility;
    second: Utility;
  },
> = string extends Init["input"]
  ? readonly [string, EvalUtility<Init["first"], string>[1]]
  : EvalUtility<Init["first"], Init["input"]> extends infer $Data
    ? [$Data] extends [never] ? never
    : $Data extends readonly [infer $Input, infer $Result]
      ? $Input extends string
        ? EvalUtility<Init["second"], $Input> extends
          readonly [infer $Input, any] ? readonly [$Input, $Result]
        : never
      : never
    : never
  : never;

export class Terminated<
  First extends Utility,
  Second extends Utility,
> implements Parser {
  key = "terminated" as const;
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
  ): TerminatedHelper<{ first: First; second: Second; input: I }> {
    const [input, result] = (this.first.parse as any)(input_);
    const [finalInput, _] = (this.second.parse as any)(input);
    return [finalInput, result] as any;
  }
}

/**
 * Gets the result of the first parser then sends the input to the second
 * parser and returns the first result along with the final input.
 *
 * @param first the first parser to get the result from
 * @param second the second parser to consume input from
 * @returns the unconsumed input and first parser's result
 */
export function terminated<First extends Utility, Second extends Utility>(
  first: First,
  second: Second,
): Terminated<First, Second> {
  return new Terminated(first, second);
}
