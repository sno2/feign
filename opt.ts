import type { EvalUtility, Utility } from "./utilities.ts";

export type OptHelper<Init extends { input: string; util: Utility }> =
  string extends Init["input"]
    ? EvalUtility<Init["util"], string> extends
      readonly [infer $RestI, infer $Result] ? readonly [$RestI, $Result | null]
    : never
    : EvalUtility<Init["util"], Init["input"]> extends infer $Data
      ? [$Data] extends [never] ? readonly [Init["input"], null]
      : $Data extends readonly [infer $RestI, infer $Result]
        ? readonly [$RestI, $Result]
      : never
    : never;

export class Opt<Util extends Utility> {
  key = "opt" as const;

  constructor(readonly util: Util) {}

  parse<I extends string>(input: I): OptHelper<{ input: I; util: Util }> {
    try {
      return (this.util.parse as any)(input) as any;
    } catch {
      return [input, null] as any;
    }
  }
}

export function opt<Util extends Utility>(utility: Util): Opt<Util> {
  return new Opt(utility);
}
