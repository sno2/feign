import { alpha1, multispace1, pair, tag, terminated, tuple } from "../mod.ts";
import {
  assertAlwaysEqual,
  assertEquals,
  assertEqualTypes,
  assertThrows,
} from "../test_deps.ts";

Deno.test("sequence/terminated", async (t) => {
  await t.step("basic", () => {
    const data = terminated(multispace1, alpha1).parse(
      "    foo   ",
    );
    assertEqualTypes<
      typeof data,
      readonly ["   ", "    "]
    >();
    assertEquals(data, ["   ", "    "]);
  });

  await t.step("invalid input", () => {
    assertThrows(() => {
      const data = terminated(multispace1, alpha1).parse("foo   ");
      assertEqualTypes<typeof data, never>();
    });
  });

  await t.step("non-exact string types", async (t) => {
    await t.step("basic", () => {
      const result = terminated(pair(alpha1, multispace1), alpha1).parse(
        "helllo a" as string,
      );
      assertEqualTypes<
        typeof result,
        readonly [string, readonly [string, string]]
      >();
    });

    await t.step("complicated", () => {
      const parser = terminated(
        tuple(terminated(alpha1, multispace1), alpha1),
        tuple(multispace1, tag("is"), multispace1, tag("cool")),
      );

      const result = parser.parse("jon   doe   is  cool" as string);
      assertEqualTypes<
        typeof result,
        readonly [string, readonly [string, string]]
      >();
    });
  });

  await t.step("nesting terminated", async (t) => {
    const parser = tuple(
      terminated(alpha1, multispace1),
      alpha1,
      tuple(tag("("), terminated(alpha1, tag(")"))),
    );

    await t.step("valid input", () => {
      const result = parser.parse("hello world(og)too bad");
      assertAlwaysEqual(
        result,
        ["too bad", ["hello", "world", ["(", "og"]]] as const,
      );
    });

    await t.step("invalid input", () => {
      assertThrows(() => {
        const result = parser.parse("hello world(ogtoo bad");
        assertEqualTypes<typeof result, never>();
      });
    });
  });
});
