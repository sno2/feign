import {
  alpha1,
  delimited,
  many0,
  multispace0,
  preceded,
  tag,
  tuple,
} from "../mod.ts";
import { assertAlwaysEqual } from "../test_deps.ts";

Deno.test("integration_tests/function_shape", () => {
  // you must include ',' after parameter for now...
  const funcParser = tuple(
    delimited(
      tuple(tag("function"), multispace0),
      alpha1,
      multispace0,
    ),
    delimited(
      tag("("),
      many0(delimited(multispace0, alpha1, preceded(multispace0, tag(",")))),
      tuple(tag(")"), multispace0, tag(";")),
    ),
  );

  {
    const result = funcParser.parse("function  foo  (a,b , c ,) ;");
    assertAlwaysEqual(result, ["", ["foo", ["a", "b", "c"]]] as const);
  }

  {
    const result = funcParser.parse("function asdf(b,c,d,);rest");
    assertAlwaysEqual(result, ["rest", ["asdf", ["b", "c", "d"]]] as const);
  }
});
