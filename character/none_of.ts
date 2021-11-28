import type { Parser } from "../utilities.ts";
import type { Chars } from "./utils.ts";
import { paramControlSymb } from "../lock_symbol.ts";
import { FeignError } from "../error.ts";

type NoneOfHelperRec<
  Init extends { input: string; schema: readonly string[] },
  $RestSchema extends readonly string[] = Init["schema"],
> = $RestSchema extends readonly [infer $F, ...infer $RestSchema]
  ? $F extends string
    ? Init["input"] extends `${infer $Ch}${infer _}`
      ? $F extends $Ch ? never : NoneOfHelperRec<
        Init,
        $RestSchema extends readonly string[] ? $RestSchema : never
      >
    : Init["input"] extends `${infer $FirstCh}${infer $RestI}`
      ? readonly [$RestI, $FirstCh]
    : never
  : never
  : Init["input"] extends `${infer $FirstCh}${infer $RestI}`
    ? readonly [$RestI, $FirstCh]
  : never;

export type NoneOfHelper<
  Init extends { input: string; schema: readonly string[] },
> = readonly string[] extends Init["schema"] ? readonly [string, string]
  : string extends Init["input"] ? readonly [string, string]
  : NoneOfHelperRec<Init>;

export class NoneOf<CharSchema extends readonly string[]> implements Parser {
  key = "noneOf" as const;

  constructor(readonly schema: CharSchema) {}

  parse<I extends string>(
    input: I,
  ): NoneOfHelper<{ input: I; schema: CharSchema }> {
    const ch = input.charAt(0);
    for (const option of this.schema) {
      if (ch === option) {
        throw new FeignError({
          type: "expected",
          location: "character schema",
          expected: this.schema.map((a) => `"${a}"`).join(" | "),
          expectedExclusion: true,
          got: `"${ch}"`,
        });
      }
    }
    return [input.slice(1), ch] as any;
  }
}

/**
 * Creates a parser that parses any single character that is not in the
 * specified schema.
 *
 * ## Examples
 *
 * ```ts
 * import { noneOf } from "./none_of.ts";
 * const schema = noneOf("not us");
 * schema.parse("im safe"); // 'readonly ["m safe", "i"]'
 * schema.parse(" "); // 'never' - throws error as schema in includes space
 * ```
 *
 * ## Notes
 *
 * - This parser will fail at compile-time and runtime if the specified schema
 *   is an empty string.
 */
export function noneOf<I extends string>(
  schema: I,
  ..._stringChecker: string extends I ? []
    : "" extends I ? [invalidInputLock: typeof paramControlSymb]
    : []
): string extends I ? NoneOf<readonly string[]>
  : "" extends I ? never
  : NoneOf<Chars<I>> {
  const chars = schema.split("");
  if (chars.length === 0) {
    throw new FeignError({
      type: "no-input",
      location: "character schema",
    });
  }
  return new NoneOf(chars) as any;
}
