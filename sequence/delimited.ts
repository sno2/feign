import type { EvalUtility, Parser, Utility } from "../utilities.ts";

export type DelimitedHelper<
  Init extends {
    input: string;
    start: Utility;
    middle: Utility;
    end: Utility;
  },
> = //
  string extends Init["input"] ? readonly [
    string,
    EvalUtility<
      Init["middle"],
      string
    >[1],
  ]
    : EvalUtility<Init["start"], Init["input"]> extends infer $Data
      ? [$Data] extends [never] ? never
      : $Data extends readonly [infer $RestI, any] ? EvalUtility<
        Init["middle"],
        $RestI extends string ? $RestI : never
      > extends infer $Data ? [$Data] extends [never] ? never
      : $Data extends readonly [infer $RestI, infer $Result] ? EvalUtility<
        Init["end"],
        $RestI extends string ? $RestI : never
      > extends infer $Data ? [$Data] extends [never] ? never
      : $Data extends readonly [infer $RestI, any] ? readonly [$RestI, $Result]
      : never
      : never
      : never
      : never
      : never
    : never;

export class Delimited<
  Start extends Utility,
  Middle extends Utility,
  End extends Utility,
> implements Parser {
  key = "delimited" as const;

  constructor(
    readonly start: Start,
    readonly middle: Middle,
    readonly end: End,
  ) {
  }

  parse<I extends string>(
    input_: I,
  ): DelimitedHelper<{ input: I; start: Start; middle: Middle; end: End }> {
    let input: string = input_;
    input = (this.start.parse as any)(input)[0];
    let result: unknown;
    [input, result] = (this.middle.parse as any)(input);
    input = (this.end.parse as any)(input)[0];
    return [input, result] as any;
  }
}

export function delimited<
  Start extends Utility,
  Middle extends Utility,
  Last extends Utility,
>(start: Start, middle: Middle, last: Last): Delimited<Start, Middle, Last> {
  return new Delimited(start, middle, last);
}
