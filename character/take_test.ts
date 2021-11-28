import { take } from "./take.ts";
import {
  assertAlwaysEqual,
  assertEqualTypes,
  assertThrows,
} from "../test_deps.ts";

Deno.test("character/take", async (t) => {
  const parser = take(5);

  await t.step("valid input", () => {
    {
      const result = parser.parse("abcde");
      assertAlwaysEqual(result, ["", ["a", "b", "c", "d", "e"]] as const);
    }

    {
      const result = parser.parse("abcdeDONE");
      assertAlwaysEqual(result, ["DONE", ["a", "b", "c", "d", "e"]] as const);
    }
  });

  await t.step("non-integer numbers fail", () => {
    assertThrows(() => {
      take(5.3);
    });
  });

  await t.step("negative numbers fail", () => {
    assertThrows(() => {
      take(-2);
    });
  });

  await t.step("zero fails", () => {
    assertThrows(() => {
      take(0);
    });
  });

  await t.step("non-exact number types", () => {
    const result = take(5 as number).parse("123456");
    assertEqualTypes<
      typeof result,
      readonly [string, readonly string[]]
    >();
  });

  await t.step("non-exact string types", () => {
    const result = take(5).parse("123456" as string);
    assertEqualTypes<
      typeof result,
      readonly [string, readonly string[]]
    >();
  });
});
