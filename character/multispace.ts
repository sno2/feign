import { isWhitespace, TakeCharWhileHelper } from "./utils.ts";
import type { CharMatcher } from "./utils.ts";
import type { Parser } from "../utilities.ts";
import { FeignError } from "../error.ts";

export type Multispace0Helper<
  T extends string,
> = TakeCharWhileHelper<
  { input: T; schema: CharMatcher.Whitespace; needLeast1: false }
>;

export class Multispace0 implements Parser {
  key = "multispace0" as const;

  parse<T extends string>(s: T): Multispace0Helper<T> {
    let end = 0;
    for (let i = 0; i < s.length; i++) {
      if (isWhitespace(s.charCodeAt(i))) {
        end += 1;
      } else {
        break;
      }
    }

    return [s.slice(end), s.slice(0, end)] as any;
  }
}

export const multispace0 = new Multispace0();

export type Multispace1Helper<
  T extends string,
> = TakeCharWhileHelper<
  { input: T; needLeast1: true; schema: CharMatcher.Whitespace }
>;

export class Multispace1 implements Parser {
  key = "multispace1" as const;

  parse<T extends string>(s: T): Multispace1Helper<T> {
    if (s.length === 0) {
      throw new FeignError({
        type: "no-input",
        location: "multispace1 input",
      });
    }

    let end = 0;
    for (let i = 0; i < s.length; i++) {
      if (isWhitespace(s.charCodeAt(i))) {
        end += 1;
        continue;
      }

      if (i === 0) {
        throw new FeignError({
          type: "expected",
          expected: `"\\n" | "\\r" | "\\t" | " "`,
          got: `"${s.charAt(i)}"`,
          location: "multispace1 input",
        });
      }

      break;
    }

    return [s.slice(end), s.slice(0, end)] as any;
  }
}

export const multispace1 = new Multispace1();
