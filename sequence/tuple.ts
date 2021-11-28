import type {
  DefaultUtilValues,
  EvalUtility,
  Parser,
  Utility,
} from "../utilities.ts";

type _TupleHelper<
  Init extends {
    input: string;
    utils: readonly Utility[];
  },
  $RestI extends string = Init["input"],
  $Utils extends readonly Utility[] = Init["utils"],
  $Results extends readonly unknown[] = readonly [],
> = $Utils extends readonly [infer $Util, ...infer $Utils]
  ? $Utils extends Utility[]
    ? EvalUtility<$Util extends Utility ? $Util : never, $RestI> extends
      infer $Data ? [$Data] extends [never] ? never
    : $Data extends readonly [infer $RestI, infer $Res]
      ? $RestI extends string ? _TupleHelper<
        Init,
        $RestI,
        $Utils,
        readonly [...$Results, $Res]
      >
      : never
    : never
    : never
  : never
  : readonly [$RestI, $Results];

export type TupleHelper<
  Init extends {
    input: string;
    utils: readonly Utility[];
  },
> = string extends Init["input"]
  ? readonly [string, DefaultUtilValues<Init["utils"]>]
  : _TupleHelper<Init>;

export class Tuple<
  Utils extends readonly Utility[],
> implements Parser {
  key = "tuple" as const;
  readonly utils: Utils;

  constructor(utils: Utils) {
    this.utils = utils;
  }

  parse<I extends string>(input_: I): TupleHelper<{ utils: Utils; input: I }> {
    const { utils } = this;

    let input: string = input_;
    const results = Array(utils.length);
    for (let i = 0; i < utils.length; i++) {
      const [inp, result] = (utils[i].parse as any)(input);
      input = inp;
      results[i] = result;
    }
    return [input, results] as any;
  }
}

export function tuple<Utils extends readonly Utility[]>(
  ...utils: Utils
): Tuple<Utils> {
  return new Tuple(utils);
}
