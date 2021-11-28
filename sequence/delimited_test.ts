import {
  assertAlwaysEqual,
  assertEqualTypes,
  assertThrows,
} from "../test_deps.ts";
import { alpha1, delimited, multispace0, multispace1, tag } from "../mod.ts";

Deno.test("sequence/delimited", async (t) => {
  await t.step("fully consumed input", () => {
    const result = delimited(multispace1, alpha1, multispace1).parse(
      "  \n  foo  ",
    );
    const expected = ["", "foo"] as const;
    assertAlwaysEqual(result, expected);
  });

  await t.step("partially consumed input", () => {
    const parser = delimited(multispace0, alpha1, multispace0);
    const result = parser.parse("foo123");
    const expected = ["123", "foo"] as const;
    assertAlwaysEqual(result, expected);
  });

  await t.step("empty input + no consumed input", () => {
    const parser = delimited(tag(""), tag(""), tag(""));
    const result = parser.parse("");
    const expected = ["", ""] as const;
    assertAlwaysEqual(result, expected);
  });

  await t.step("nesting delimited", async (t) => {
    const parser = delimited(
      tag("("),
      delimited(multispace0, alpha1, multispace0),
      tag(")"),
    );

    await t.step("valid input", () => {
      const result = parser.parse("( hello  )");
      const expected = ["", "hello"] as const;
      assertAlwaysEqual(result, expected);
    });

    await t.step("invalid input", () => {
      assertThrows(() => {
        const result = parser.parse("( hello ");
        assertEqualTypes<typeof result, never>();
      });
    });

    await t.step("non-exact string type", () => {
      {
        const result = parser.parse("( hello  )" as string);
        assertEqualTypes<
          typeof result,
          readonly [
            string,
            string,
          ]
        >();
      }

      {
        const result = parser.parse("(hello)" as string);
        assertEqualTypes<
          typeof result,
          readonly [
            string,
            string,
          ]
        >();
      }
    });
  });
});
