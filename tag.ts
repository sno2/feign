import type { Parser } from "./utilities.ts";
import { FeignError } from "./error.ts";

export type TagHelper<P extends string, I extends string> =
  //
  string extends (I | P) ? readonly [string, string]
    : I extends `${P}${infer $Rest}` ? readonly [$Rest, P]
    : never;

export class Tag<P extends string> implements Parser {
  key = "tag" as const;
  readonly pat: P;

  constructor(pat: P) {
    this.pat = pat;
  }

  parse<I extends string>(i: I): TagHelper<P, I> {
    const { pat } = this;

    const maybe = i.slice(0, pat.length);
    if (maybe !== pat) {
      throw new FeignError({
        type: "unknown",
        message: "Failed to consume pattern in input.",
      });
    }
    return [i.slice(pat.length), maybe] as any;
  }
}

export function tag<P extends string>(pat: P): Tag<P> {
  return new Tag(pat);
}
