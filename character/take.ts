import { FeignError } from "../error.ts";

export type TakeHelperRec<
  Init extends { input: string; n: number },
  $Rest extends string = Init["input"],
  $Acc extends readonly string[] = readonly [],
> = Init["n"] extends $Acc["length"] ? readonly [$Rest, $Acc]
  : $Rest extends `${infer $Ch}${infer $Rest}`
    ? TakeHelperRec<Init, $Rest, readonly [...$Acc, $Ch]>
  : readonly [$Rest, $Acc];

export type TakeHelper<
  Init extends { input: string; n: number },
> = string extends Init["input"] ? readonly [string, readonly string[]]
  : number extends Init["n"] ? readonly [string, readonly string[]]
  : TakeHelperRec<Init>;

export class Take<N extends number> {
  key = "take" as const;
  constructor(readonly n: N) {
    if (n <= 0 || n % 1 !== 0) {
      throw new FeignError({
        type: "expected",
        location: "take number",
        expected: "<positive integer>",
        got: n.toString(),
      });
    }
  }

  parse<I extends string>(s: I): TakeHelper<{ input: I; n: N }> {
    if (s.length < this.n) {
      throw new FeignError({
        type: "unknown",
        message:
          `Expected a length of at least '${this.n}', found length of '${s.length}' for take operation.`,
      });
    }
    return [s.slice(this.n), s.slice(0, this.n).split("")] as any;
  }
}

/**
 * Creates a parser takes `n` characters from the input. `n` must be a positive
 * integer greater than `0`.
 */
export function take<N extends number>(
  n: N,
): `${N}` extends `-${number}` ? never
  : `${N}` extends `${string}.${string}` ? never
  : Take<N> {
  return new Take(n) as any;
}
