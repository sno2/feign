// deno-lint-ignore-file no-unreachable

import type { EvalUtility, Parser, Utility } from "../utilities.ts";
import { FeignError } from "../error.ts";

export type _Many0Helper<
  Init extends { input: string; util: Utility },
  $RestI extends string = Init["input"],
  $Results extends readonly unknown[] = readonly [],
> = EvalUtility<Init["util"], $RestI> extends infer $Data
  ? [$Data] extends [never] ? readonly [$RestI, $Results]
  : $Data extends readonly [infer $RestI, infer $Res]
    ? $RestI extends string ? _Many0Helper<
      Init,
      $RestI,
      readonly [...$Results, $Res]
    >
    : never
  : never
  : never;

export type Many0Helper<
  Init extends { input: string; util: Utility },
> = string extends Init["input"]
  ? readonly [string, readonly EvalUtility<Init["util"], string>[1][]]
  : _Many0Helper<Init>;

export class Many0<Util extends Utility> implements Parser {
  key = "many0" as const;

  constructor(readonly util: Util) {
  }

  parse<T extends string>(
    input_: T,
  ): Many0Helper<{ input: T; util: Util }> {
    let input: string = input_;
    const results = [];
    try {
      while (1) {
        const [i, result] = (this.util.parse as any)(input);
        results.push(result);
        input = i;
      }
    } catch (_) {
      return [input, results] as any;
    }
    return [input, results] as any;
  }
}

export function many0<Util extends Utility>(util: Util): Many0<Util> {
  return new Many0(util);
}

export type _Many1Helper<
  Init extends { input: string; util: Utility },
  $RestI extends string = Init["input"],
  $Results extends readonly unknown[] = readonly [],
> = EvalUtility<Init["util"], $RestI> extends infer $Data
  ? [$Data] extends [never]
    ? 0 extends $Results["length"] ? never : readonly [$RestI, $Results]
  : $Data extends readonly [infer $RestI, infer $Res]
    ? $RestI extends string ? _Many0Helper<
      Init,
      $RestI,
      readonly [...$Results, $Res]
    >
    : never
  : never
  : never;

export type Many1Helper<
  Init extends { input: string; util: Utility },
> = string extends Init["input"]
  ? readonly [string, readonly EvalUtility<Init["util"], string>[1][]]
  : _Many1Helper<Init>;

export class Many1<Util extends Utility> implements Parser {
  key = "many1" as const;

  constructor(readonly util: Util) {}

  parse<T extends string>(
    input_: T,
  ): Many1Helper<{ input: T; util: Util }> {
    let input: string = input_;
    const results = [];
    try {
      while (1) {
        const [i, result] = (this.util.parse as any)(input);
        results.push(result);
        input = i;
      }
    } catch (_) {
      return [input, results] as any;
    }
    if (results.length === 0) {
      throw new FeignError({
        type: "unknown",
        message: "Expected at least one result in many1.",
      });
    }
    return [input, results] as any;
  }
}

export function many1<Util extends Utility>(util: Util): Many1<Util> {
  return new Many1(util);
}
