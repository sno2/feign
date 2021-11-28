import {
  alpha1,
  multispace0,
  opt,
  pair,
  preceded,
  tag,
  terminated,
} from "./mod.ts";
import { assertAlwaysEqual, assertEqualTypes } from "./test_deps.ts";

Deno.test("opt", async (t) => {
  await t.step("no consumed input", () => {
    const parser = opt(alpha1);
    const result = parser.parse("123");
    const expected = ["123", null] as const;
    assertAlwaysEqual(result, expected);
  });

  await t.step("consumed input", () => {
    const parser = opt(alpha1);
    const result = parser.parse("asdf123");
    const expected = ["123", "asdf"] as const;
    assertAlwaysEqual(result, expected);
  });

  await t.step("non-exact string type", async (t) => {
    await t.step("some consumed", () => {
      const result = opt(alpha1).parse("asdf" as string);
      assertEqualTypes<typeof result, readonly [string, string | null]>();
    });

    await t.step("none consumed", () => {
      const result = opt(pair(alpha1, tag("!"))).parse("a!" as string);
      assertEqualTypes<
        typeof result,
        readonly [string, readonly [string, string] | null]
      >();
    });
  });

  await t.step("nesting opt", () => {
    const parser = pair(
      pair(alpha1, terminated(opt(tag("?")), tag(":"))),
      preceded(multispace0, alpha1),
    );

    {
      const result = parser.parse("foo?: true\n");
      assertAlwaysEqual(
        result,
        ["\n", [["foo", "?"], "true"]] as const,
      );
    }

    {
      const result = parser.parse("name: false");
      assertAlwaysEqual(result, ["", [["name", null], "false"]] as const);
    }
  });
});
