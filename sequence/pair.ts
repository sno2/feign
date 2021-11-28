import type { EvalUtility, Parser, Utility } from "../utilities.ts";

export type PairHelper<
  Init extends {
    input: string;
    first: Utility;
    second: Utility;
  },
> = //
  string extends Init["input"] ? readonly [
    string,
    readonly [
      EvalUtility<Init["first"], string>[1],
      EvalUtility<Init["second"], string>[1],
    ],
  ]
    : EvalUtility<Init["first"], Init["input"]> extends infer $FirstData
      ? [$FirstData] extends [never] ? never
      : $FirstData extends readonly [infer $Input, infer $Res1] ? EvalUtility<
        Init["second"],
        $Input extends string ? $Input : never
      > extends infer $SecondData ? [$SecondData] extends [never] ? never
      : $SecondData extends readonly [infer $Input, infer $Res2]
        ? readonly [$Input, readonly [$Res1, $Res2]]
      : never
      : never
      : never
    : never;

export class Pair<
  First extends Utility,
  Second extends Utility,
> implements Parser {
  key = "pair" as const;

  constructor(readonly first: First, readonly second: Second) {
  }

  parse<I extends string>(
    input_: I,
  ): PairHelper<{ first: First; second: Second; input: I }> {
    const [input, res1] = (this.first.parse as any)(input_);
    const [finalInput, res2] = (this.second.parse as any)(input);
    return [finalInput, [res1, res2]] as any;
  }
}

export function pair<First extends Utility, Second extends Utility>(
  first: First,
  second: Second,
): Pair<First, Second> {
  return new Pair(first, second) as any;
}
