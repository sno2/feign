import { isAlpha, TakeCharWhileHelper } from "./utils.ts";
import type { CharMatcher } from "./utils.ts";
import type { Parser } from "../utilities.ts";

export type Alpha0Helper<
  T extends string,
> = TakeCharWhileHelper<
  { input: T; schema: CharMatcher.Alpha; needLeast1: false }
>;

export class Alpha0 implements Parser {
  key = "alpha0" as const;

  parse<T extends string>(s: T): Alpha0Helper<T> {
    let end = 0;
    for (let i = 0; i < s.length; i++) {
      if (isAlpha(s.charCodeAt(i))) {
        end += 1;
      } else {
        break;
      }
    }

    return [s.slice(end), s.slice(0, end)] as any;
  }
}

/** Parses zero or more alphabetical (case-insenstive) characters. */
export const alpha0 = new Alpha0();

export type Alpha1Helper<
  T extends string,
> = TakeCharWhileHelper<
  { input: T; needLeast1: true; schema: CharMatcher.Alpha }
>;

export class Alpha1 implements Parser {
  key = "alpha1" as const;

  parse<T extends string>(s: T): Alpha1Helper<T> {
    if (s.length === 0) {
      throw new Error("Expected at least one alphabetical letter.");
    }

    let end = 0;
    for (let i = 0; i < s.length; i++) {
      if (isAlpha(s.charCodeAt(i))) {
        end += 1;
        continue;
      }

      if (i === 0) {
        throw new Error("Expected at least one alphabetical letter.");
      }

      break;
    }

    return [s.slice(end), s.slice(0, end)] as any;
  }
}

/**
 * Parses one or more alphabetical (case-insenstive) characters. If the input
 * is empty or does not include at least one alphabetical character then it will fail.
 */
export const alpha1 = new Alpha1();
