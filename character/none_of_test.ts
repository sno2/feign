import {
  assertAlwaysEqual,
  assertEqualTypes,
  assertThrows,
} from "../test_deps.ts";
import { noneOf } from "./none_of.ts";

Deno.test("character/none_of", async (t) => {
  const notAbcParser = noneOf("abc");
  await t.step("valid input", () => {
    {
      const result = notAbcParser.parse(" person");
      assertAlwaysEqual(result, ["person", " "] as const);
    }

    {
      const result = notAbcParser.parse("little");
      assertAlwaysEqual(result, ["ittle", "l"] as const);
    }
  });

  await t.step("invalid input", () => {
    assertThrows(() => {
      const result = notAbcParser.parse("cuz");
      assertEqualTypes<typeof result, never>();
    });
  });

  await t.step("empty schema", () => {
    assertThrows(() => {
      // @ts-expect-error We are testing the behavior.
      const parser = noneOf("");
      assertEqualTypes<typeof parser, never>();
    });
  });

  await t.step("non-exact string types", async (t) => {
    const nonExactParser = noneOf("abc" as string);

    await t.step("non-exact schema", () => {
      const result = nonExactParser.parse("d");
      assertEqualTypes<typeof result, readonly [string, string]>();
    });

    await t.step("non-exact input", () => {
      const result = notAbcParser.parse("d" as string);
      assertEqualTypes<typeof result, readonly [string, string]>();
    });

    await t.step("non-exact schema and input", () => {
      const result = nonExactParser.parse("d" as string);
      assertEqualTypes<typeof result, readonly [string, string]>();
    });
  });
});
