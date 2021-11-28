import { FeignError } from "../error.ts";
export type TakeWhilePredicate = (ch: string) => boolean;

export type TakeWhileHelper = readonly [string, readonly string[]];

export class TakeWhile<Predicate extends TakeWhilePredicate> {
  key = "takeWhile" as const;
  constructor(readonly predicate: Predicate) {}

  parse<I extends string>(s: I): TakeWhileHelper {
    let end = 0;
    for (; end < s.length; end++) {
      if (this.predicate(s.charAt(end)) !== true) {
        break;
      }
    }
    return [s.slice(end), s.slice(0, end).split("")] as any;
  }
}

/**
 * Creates a parser continuously takes characters as long as a predicate returns
 * `true`. Exact types are normalized when using this parser.
 */
export function takeWhile<Cb extends TakeWhilePredicate>(
  predicate: Cb,
): TakeWhile<Cb> {
  return new TakeWhile(predicate) as any;
}
