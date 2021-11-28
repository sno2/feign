import type { CharMatcher, TakeCharWhileHelper } from "./utils.ts";
import { isHexDigit } from "./utils.ts";
import { FeignError } from "../error.ts";
import type { Parser } from "../utilities.ts";

export type HexDigit0Helper<I extends string> = TakeCharWhileHelper<
  { input: I; schema: CharMatcher.HexDigit; needLeast1: false }
>;

export class HexDigit0 implements Parser {
  key = "hexdigit0" as const;

  parse<I extends string>(s: I): HexDigit0Helper<I> {
    let end = 0;
    for (let i = 0; i < s.length; i++) {
      if (isHexDigit(s.charCodeAt(i))) {
        end += 1;
      } else {
        break;
      }
    }

    return [s.slice(end), s.slice(0, end)] as any;
  }
}

/** Parses zero or more hex digits (`"a" | "b" | "c" | "d" | "e" | "f" | "0" .. "9"`). */
export const hexdigit0 = new HexDigit0();

export type HexDigit1Helper<I extends string> = TakeCharWhileHelper<
  { input: I; schema: CharMatcher.HexDigit; needLeast1: true }
>;

export class HexDigit1 implements Parser {
  key = "hexdigit1" as const;

  parse<I extends string>(s: I): HexDigit1Helper<I> {
    if (s.length === 0) {
      throw new FeignError({
        type: "no-input",
        location: "hexdigit1 input",
      });
    }

    let end = 0;
    for (let i = 0; i < s.length; i++) {
      if (isHexDigit(s.charCodeAt(i))) {
        end += 1;
        continue;
      }

      if (i === 0) {
        throw new FeignError({
          type: "expected",
          expected: `"a" | "b" | "c" | "d" | ${
            Array(9).fill(undefined).map((_, i) => `"${i + 1}"`).join(" | ")
          }`,
          got: `"${s.charAt(i)}"`,
          location: "hexdigit1 input",
        });
      }

      break;
    }

    return [s.slice(end), s.slice(0, end)] as any;
  }
}

/**
 * Parses one or more hex digit
 * (`"a" | "b" | "c" | "d" | "e" | "f" | "0" .. "9"`). This will fail if the
 * input is empty or there is not at least one hex digit.
 */
export const hexdigit1 = new HexDigit1();
