import type { EvalUtility, Utility } from "../utilities.ts";

export type MapHelper<
  Init extends {
    input: string;
    util: Utility;
    callbackReturnType: unknown;
  },
> = EvalUtility<Init["util"], Init["input"]> extends infer $Data
  ? [$Data] extends [never] ? never
  : $Data extends readonly [infer $RestI, any]
    ? $RestI extends string ? readonly [
      $RestI,
      Init["callbackReturnType"],
    ]
    : never
  : never
  : never;

/** Named `MapComb` to not conflict with built-in `Map`. */
export class MapComb<
  Util extends Utility,
  Cb extends (data: EvalUtility<Util, string>[1]) => unknown,
> {
  key = "map" as const;

  constructor(readonly util: Util, readonly cb: Cb) {}

  parse<I extends string>(
    input: I,
  ): MapHelper<{ input: I; callbackReturnType: ReturnType<Cb>; util: Util }> {
    const [i, d] = (this.util.parse as any)(input);
    return [i, (this.cb as any)(d as any)] as any;
  }
}

/**
 * Maps the result of the given utility into the function then return the
 * original input and data.
 *
 * Note: this does not support exact types (i.e. `asdf` resolves to `string` and
 * `23` resolves to `number`) for the data when mapping. Therefore, if you wish
 * to have that behavior then you need to manually pass the inputs between
 * various parsers and call each sequencially.
 */
export function map<
  Util extends Utility,
  Cb extends <I extends EvalUtility<Util, string>[1]>(data: I) => unknown,
>(util: Util, cb: Cb) {
  return new MapComb(util, cb);
}
