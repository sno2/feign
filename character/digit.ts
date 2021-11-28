import { isDigit, TakeCharWhileHelper } from "./utils.ts";
import type { CharMatcher } from "./utils.ts";
import type { Parser } from "../utilities.ts";
import { FeignError } from "../error.ts";

export type Digit0Helper<
  T extends string,
> = TakeCharWhileHelper<
  { input: T; schema: CharMatcher.Digit; needLeast1: false }
>;

export class Digit0 implements Parser {
  key = "digit0" as const;

  parse<T extends string>(s: T): Digit0Helper<T> {
    let end = 0;
    for (let i = 0; i < s.length; i++) {
      if (isDigit(s.charCodeAt(i))) {
        end += 1;
      } else {
        break;
      }
    }

    return [s.slice(end), s.slice(0, end)] as any;
  }
}

/** Parses zero or more digits (`0` to `9`). */
export const digit0 = new Digit0();

export type Digit1Helper<
  T extends string,
> = TakeCharWhileHelper<
  { input: T; needLeast1: true; schema: CharMatcher.Digit }
>;

export class Digit1 implements Parser {
  key = "digit1" as const;

  parse<T extends string>(s: T): Digit1Helper<T> {
    if (s.length === 0) {
      throw new FeignError({
        type: "no-input",
        location: "digit1 input",
      });
    }

    let end = 0;
    for (let i = 0; i < s.length; i++) {
      if (isDigit(s.charCodeAt(i))) {
        end += 1;
        continue;
      }

      if (i === 0) {
        throw new FeignError({
          type: "expected",
          expected: Array(9).fill(undefined).map((_, i) => `"${i + 1}"`).join(
            " | ",
          ),
          got: s.charAt(i),
          location: "digit1 input",
        });
      }

      break;
    }

    return [s.slice(end), s.slice(0, end)] as any;
  }
}

/**
 * Parses one or more digits (`0` to `9`). If the input is empty or there is not at
 * least one digit, then this will fail.
 */
export const digit1 = new Digit1();
