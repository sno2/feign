import {
  assertAlwaysEqual,
  assertEqualTypes,
  assertThrows,
} from "../test_deps.ts";
import { oneOf } from "./one_of.ts";

Deno.test("character/one_of", async (t) => {
  const abcParser = oneOf("abc");
  await t.step("valid input", () => {
    {
      const result = abcParser.parse("a person");
      assertAlwaysEqual(result, [" person", "a"] as const);
    }

    {
      const result = abcParser.parse("b cuz");
      assertAlwaysEqual(result, [" cuz", "b"] as const);
    }
  });

  await t.step("invalid input", () => {
    assertThrows(() => {
      const result = abcParser.parse("");
      assertEqualTypes<typeof result, never>();
    });

    assertThrows(() => {
      const result = abcParser.parse("hello");
      assertEqualTypes<typeof result, never>();
    });
  });

  await t.step("empty schema", () => {
    assertThrows(() => {
      // @ts-expect-error We are testing the behavior.
      const parser = oneOf("");
      assertEqualTypes<typeof parser, never>();
    });
  });

  await t.step("non-exact string types", async (t) => {
    const nonExactParser = oneOf("abc" as string);

    await t.step("non-exact schema", () => {
      const result = nonExactParser.parse("a");
      assertEqualTypes<typeof result, readonly [string, string]>();
    });

    await t.step("non-exact input", () => {
      const result = abcParser.parse("b" as string);
      assertEqualTypes<typeof result, readonly [string, "a" | "b" | "c"]>();
    });

    await t.step("non-exact schema and input", () => {
      const result = nonExactParser.parse("a" as string);
      assertEqualTypes<typeof result, readonly [string, string]>();
    });
  });
});
