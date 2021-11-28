import type { Parser } from "../utilities.ts";
import type { Chars } from "./utils.ts";
import { paramControlSymb } from "../lock_symbol.ts";
import { FeignError } from "../error.ts";

type OneOfHelperRec<
  Init extends { input: string; schema: readonly string[] },
  $RestSchema extends readonly string[] = Init["schema"],
> = $RestSchema extends readonly [infer $F, ...infer $RestSchema]
  ? $F extends string
    ? Init["input"] extends `${$F}${infer $RestI}` ? readonly [$RestI, $F]
    : OneOfHelperRec<
      Init,
      $RestSchema extends readonly string[] ? $RestSchema : never
    >
  : never
  : never;

export type OneOfHelper<
  Init extends { input: string; schema: readonly string[] },
> = readonly string[] extends Init["schema"] ? readonly [string, string]
  : string extends Init["input"] ? readonly [string, Init["schema"][number]]
  : OneOfHelperRec<Init>;

export class OneOf<CharSchema extends readonly string[]> implements Parser {
  key = "oneOf" as const;

  constructor(readonly schema: CharSchema) {}

  parse<I extends string>(
    input: I,
  ): OneOfHelper<{ input: I; schema: CharSchema }> {
    const ch = input.charAt(0);
    for (const option of this.schema) {
      if (ch === option) {
        return [input.slice(1), ch] as any;
      }
    }
    throw new FeignError({
      type: "expected",
      location: "character schema",
      expected: this.schema.map((a) => `"${a}"`).join(" | "),
      got: `"${ch}"`,
    });
  }
}

/**
 * Creates a parser that parses a character that is one of the characters in
 * the given schema string.
 *
 * ## Examples
 *
 * ```ts
 * import { oneOf } from "./one_of.ts";
 * const schema = oneOf("p");
 * schema.parse("person"); // 'readonly ["erson", "p"]'
 * schema.parse("fun"); // 'never' - throws error
 * ```
 *
 * ## Notes
 *
 * - This parser will fail at compile-time and runtime if the specified schema
 *   is an empty string.
 */
export function oneOf<I extends string>(
  schema: I,
  ..._stringChecker: string extends I ? []
    : "" extends I ? [invalidInputLock: typeof paramControlSymb]
    : []
): string extends I ? OneOf<readonly string[]>
  : "" extends I ? never
  : OneOf<Chars<I>> {
  const chars = schema.split("");
  if (chars.length === 0) {
    throw new FeignError({
      type: "no-input",
      location: "character schema",
    });
  }
  return new OneOf(chars) as any;
}
