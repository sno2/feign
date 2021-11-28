export const isAlpha = (c: number) =>
  (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
export const isDigit = (c: number) => c >= 48 && c <= 57;
export const isWhitespace = (c: number) =>
  c === 10 || c === 13 || c === 9 || c === 32;
export const isHexDigit = (c: number) =>
  isDigit(c) || (c >= 97 && c <= 102) || (c >= 65 && c <= 70);

export type Chars<
  S extends string,
  $Rest extends string = S,
  $Acc extends readonly string[] = readonly [],
> = $Rest extends `${infer $Ch}${infer $Rest}`
  ? Chars<S, $Rest, readonly [...$Acc, $Ch]>
  : $Acc;

export declare namespace CharMatcher {
  export type AlphaLower =
    | "a"
    | "b"
    | "c"
    | "d"
    | "e"
    | "f"
    | "g"
    | "h"
    | "i"
    | "j"
    | "k"
    | "l"
    | "m"
    | "n"
    | "o"
    | "p"
    | "q"
    | "r"
    | "s"
    | "t"
    | "u"
    | "v"
    | "w"
    | "x"
    | "y"
    | "z";
  export type AlphaUpper = Uppercase<AlphaLower>;
  export type Alpha = AlphaLower | AlphaUpper;
  export type Whitespace = "\n" | "\r" | "\t" | " ";
  export type Digit = `${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;
  type _HexDigitLetter = "a" | "b" | "c" | "d" | "e" | "f";
  export type HexDigit = Digit | _HexDigitLetter | Uppercase<_HexDigitLetter>;
}

type _TakeCharWhileHelper<
  Init extends {
    input: string;
    schema: string;
    needLeast1: boolean;
  },
  $Rest extends string = Init["input"],
  $Acc extends string = "",
> = $Rest extends `${infer $Ch}${infer $Rest}`
  ? $Ch extends Init["schema"]
    ? _TakeCharWhileHelper<Init, $Rest, `${$Acc}${$Ch}`>
  : "" extends $Acc ? true extends Init["needLeast1"] ? never
  : readonly [`${$Ch}${$Rest}`, $Acc]
  : readonly [`${$Ch}${$Rest}`, $Acc]
  : readonly [$Rest, $Acc];

export type TakeCharWhileHelper<
  Init extends {
    input: string;
    schema: string;
    needLeast1: boolean;
  },
> =
  //
  string extends Init["input"] ? readonly [string, string]
    : "" extends Init["input"]
      ? true extends Init["needLeast1"] ? never : readonly ["", ""]
    : _TakeCharWhileHelper<Init>;
