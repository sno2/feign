import type {
  Alpha0,
  Alpha0Helper,
  Alpha1,
  Alpha1Helper,
  Digit0,
  Digit0Helper,
  Digit1,
  Digit1Helper,
  HexDigit0,
  HexDigit0Helper,
  HexDigit1,
  HexDigit1Helper,
  Multispace0,
  Multispace0Helper,
  Multispace1,
  Multispace1Helper,
  NoneOf,
  NoneOfHelper,
  OneOf,
  OneOfHelper,
  Take,
  TakeHelper,
  TakeWhile,
  TakeWhileHelper,
} from "./character/mod.ts";
import type { Alt, AltHelper } from "./branch/mod.ts";
import type { Tag, TagHelper } from "./tag.ts";
import type {
  Delimited,
  DelimitedHelper,
  Pair,
  PairHelper,
  Preceded,
  PrecededHelper,
  Terminated,
  TerminatedHelper,
  Tuple,
  TupleHelper,
} from "./sequence/mod.ts";
import type {
  Joiner,
  JoinerHelper,
  Many0,
  Many0Helper,
  Many1,
  Many1Helper,
} from "./multi/mod.ts";
import type { Opt, OptHelper } from "./opt.ts";
import type { MapComb, MapHelper } from "./comb/mod.ts";

export interface Parser {
  readonly key: string;
  parse: (i: string) => readonly [string, unknown];
}

export type Utility =
  | Alpha0
  | Alpha1
  | Digit0
  | Digit1
  | Multispace0
  | Multispace1
  | HexDigit0
  | HexDigit1
  | Take<any>
  | TakeWhile<any>
  | Alt<any>
  | NoneOf<any>
  | OneOf<any>
  | MapComb<any, any>
  | Pair<any, any>
  | Preceded<any, any>
  | Terminated<any, any>
  | Delimited<any, any, any>
  | Tuple<any>
  | Opt<any>
  | Tag<any>
  | Many0<any>
  | Many1<any>
  | Joiner<any>;

/** This will fail if not all utilities have a `key` property. */
const __COMPILER_ASSERT: undefined extends Utility["key"] ? false : true = true;

export type EvalUtility<T extends Utility, Input extends string> = Input extends
  never ? never
  : Alpha0 extends T ? Alpha0Helper<Input>
  : Alpha1 extends T ? Alpha1Helper<Input>
  : Digit0 extends T ? Digit0Helper<Input>
  : Digit1 extends T ? Digit1Helper<Input>
  : Multispace0 extends T ? Multispace0Helper<Input>
  : Multispace1 extends T ? Multispace1Helper<Input>
  : HexDigit0 extends T ? HexDigit0Helper<Input>
  : HexDigit1 extends T ? HexDigit1Helper<Input>
  : T extends Alt<infer $Utils> ? AltHelper<{ input: Input; utils: $Utils }>
  : T extends MapComb<infer $Util, infer $Cb> ? MapHelper<
    { input: Input; util: $Util; callbackReturnType: ReturnType<$Cb> }
  >
  : T extends Take<infer $N> ? TakeHelper<{ input: Input; n: $N }>
  : T extends NoneOf<infer $Schema>
    ? NoneOfHelper<{ input: Input; schema: $Schema }>
  : T extends OneOf<infer $Schema>
    ? OneOfHelper<{ input: Input; schema: $Schema }>
  : T extends Opt<infer $Util> ? OptHelper<{ input: Input; util: $Util }>
  : T extends Tag<infer $Pat>
    ? TagHelper<$Pat extends string ? $Pat : never, Input>
  : T extends Terminated<infer $First, infer $Second>
    ? TerminatedHelper<{ input: Input; first: $First; second: $Second }>
  : T extends Preceded<infer $Util1, infer $Util2> ? PrecededHelper<
    {
      first: $Util1;
      second: $Util2;
      input: Input;
    }
  >
  : T extends Pair<infer $Util1, infer $Util2>
    ? PairHelper<{ input: Input; first: $Util1; second: $Util2 }>
  : T extends Delimited<infer $First, infer $Middle, infer $Last>
    ? DelimitedHelper<
      { input: Input; start: $First; middle: $Middle; end: $Last }
    >
  : T extends Tuple<infer $Utils> ? TupleHelper<{ input: Input; utils: $Utils }>
  : T extends Many0<infer $Util> ? Many0Helper<{ input: Input; util: $Util }>
  : T extends Many1<infer $Util> ? Many1Helper<{ input: Input; util: $Util }>
  : T extends Joiner<infer $Util> ? JoinerHelper<{ input: Input; util: $Util }>
  : T extends TakeWhile<any> ? TakeWhileHelper
  : never;

export type DefaultUtilValues<
  Utilities extends readonly Utility[],
  $RestUtils extends readonly Utility[] = Utilities,
  $Acc extends readonly unknown[] = readonly [],
> = $RestUtils extends readonly [infer $F, ...infer $Rest] ? DefaultUtilValues<
  Utilities,
  $Rest extends readonly Utility[] ? $Rest : never,
  readonly [...$Acc, $F extends Utility ? EvalUtility<$F, string>[1] : never]
>
  : $Acc;
