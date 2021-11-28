import { alpha1, digit1, multispace1, pair, preceded, tag } from "../mod.ts";
import {
  assertAlwaysEqual,
  assertEqualTypes,
  assertThrows,
} from "../test_deps.ts";

Deno.test("sequence/pair", async (t) => {
  const helloParser = pair(tag("hello "), alpha1);

  await t.step("fully consumed input", () => {
    const result = helloParser.parse("hello jon");
    assertAlwaysEqual(result, ["", ["hello ", "jon"]] as const);
  });

  await t.step("partially consumed input", () => {
    const result = helloParser.parse("hello jon doe");
    assertAlwaysEqual(result, [" doe", ["hello ", "jon"]] as const);
  });

  await t.step("nesting pair", async (t) => {
    const parser = pair(
      tag("start "),
      pair(alpha1, preceded(multispace1, digit1)),
    );

    await t.step("valid input", () => {
      const result = parser.parse("start hello 2");
      assertAlwaysEqual(
        result,
        ["", ["start ", ["hello", "2"]]] as const,
      );
    });

    await t.step("invalid input", () => {
      assertThrows(() => {
        const result = parser.parse("start 2");
        assertEqualTypes<typeof result, never>();
      });
    });
  });
});
