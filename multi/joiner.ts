import type { Many0, Many1 } from "./many.ts";
import type { EvalUtility } from "../utilities.ts";
import { FeignError } from "../error.ts";
import { Tuple } from "../sequence/tuple.ts";
import { Pair } from "../sequence/pair.ts";
import { Preceded } from "../sequence/preceded.ts";
import { Terminated } from "../sequence/terminated.ts";
import { Delimited } from "../mod.ts";

type DeepArrayFlat<T extends readonly unknown[]> = T extends
  readonly [infer $F, ...infer $Rest] ? [
  ...($F extends readonly unknown[] ? DeepArrayFlat<$F> : [$F]),
  ...DeepArrayFlat<$Rest extends readonly unknown[] ? $Rest : never>,
]
  : [];

type NestedReadonlyArray<T extends unknown> =
  readonly (T | NestedReadonlyArray<T>)[];

type JoinArrStr<T extends readonly string[]> = T extends
  readonly [infer $S, ...infer $R]
  ? `${$S extends string ? $S : never}${JoinArrStr<
    $R extends readonly string[] ? $R : never
  >}`
  : "";

export type JoinerHelper<
  Init extends { input: string; util: JoinableUtil },
> = string extends Init["input"] ? readonly [
  string,
  string,
]
  : EvalUtility<Init["util"], Init["input"]> extends
    readonly [infer $Rest, infer $Data]
    ? DeepArrayFlat<$Data extends readonly unknown[] ? $Data : never> extends
      infer $Data
      ? $Data extends readonly string[] ? readonly [$Rest, JoinArrStr<$Data>]
      : never
    : never
  : never;

type JoinableUtil =
  | Many0<any>
  | Many1<any>
  | Tuple<any>
  | Pair<any, any>
  | Preceded<any, any>
  | Terminated<any, any>
  | Delimited<any, any, any>;

export class Joiner<Util extends JoinableUtil> {
  key = "joiner" as const;
  #util: Util;

  constructor(util: Util) {
    this.#util = util;
  }

  parse<T extends string>(input: T): JoinerHelper<{ input: T; util: Util }> {
    const [i, data] = (this.#util as any).parse(input);
    if (!Array.isArray(data)) {
      throw new FeignError({
        type: "unknown",
        message: "Expected parser to return an array of strings.",
      });
    }
    return [i, data.flat().join("")] as any;
  }
}

/**
 * Joins all items in the nested string array result values from the parsers
 * within.
 */
export function joiner<Util extends JoinableUtil>(
  util: Util,
): Joiner<Util> {
  return new Joiner(util) as any;
}
