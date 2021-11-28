import type { DefaultUtilValues, EvalUtility, Utility } from "../utilities.ts";
import { FeignError } from "../error.ts";

type AltHelperRec<
  Init extends {
    input: string;
    utils: readonly (readonly [number, Utility])[];
  },
  $RestUtils extends readonly (readonly [number, Utility])[] = Init["utils"],
> = $RestUtils extends
  readonly [readonly [infer $Idx, infer $FUtil], ...infer $RestUtils]
  ? EvalUtility<$FUtil extends Utility ? $FUtil : never, Init["input"]> extends
    infer $Result ? [$Result] extends [never] ? AltHelperRec<
    Init,
    $RestUtils extends readonly (readonly [number, Utility])[] ? $RestUtils
      : never
  >
  : $Result extends readonly [infer $Result, infer $Data]
    ? readonly [$Result, readonly [$Idx, $Data]]
  : never
  : never
  : never;

type CreateEnumeratedTuple<
  T extends readonly unknown[],
  $Rest extends unknown = T,
  $Acc extends readonly (readonly [number, unknown])[] = readonly [],
> = $Rest extends readonly [infer $F, ...infer $Rest] ? CreateEnumeratedTuple<
  T,
  $Rest,
  readonly [...$Acc, readonly [$Acc["length"], $F]]
>
  : $Acc;

export type AltHelper<
  Init extends { input: string; utils: readonly Utility[] },
> = string extends Init["input"] ? readonly [
  string,
  CreateEnumeratedTuple<DefaultUtilValues<Init["utils"]>>[number],
]
  : AltHelperRec<
    { input: Init["input"]; utils: CreateEnumeratedTuple<Init["utils"]> }
  >;

export class Alt<Utils extends readonly Utility[]> {
  key = "alt" as const;

  constructor(readonly utils: Utils) {
    if (utils.length === 0) {
      throw new FeignError({
        type: "unknown",
        message: "Expected more than 0 parsers for alt combinator.",
      });
    }
  }

  parse<I extends string>(_input: I): AltHelper<{ input: I; utils: Utils }> {
    const { utils } = this;

    for (let i = 0; i < utils.length; i++) {
      try {
        const [input, data] = utils[i].parse(_input);
        return [input, [i, data]] as any;
        // deno-lint-ignore no-empty
      } catch {}
    }

    throw new FeignError({
      type: "unknown",
      message: "Failed to match one of the parsers.",
    });
  }
}

/**
 * Creates a parse that tries to match each of the parsers within until one of
 * them does not fail. The parsers list must not be empty.
 */
export function alt<Utils extends readonly Utility[]>(
  ...utils: Utils
): 0 extends Utils["length"] ? never : Alt<Utils> {
  return new Alt(utils) as any;
}
