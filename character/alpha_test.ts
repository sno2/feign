import { alpha0, alpha1 } from "./alpha.ts";
import { assertEquals, assertEqualTypes, assertThrows } from "../test_deps.ts";

Deno.test("character/alpha0", async (t) => {
  await t.step("fully consumed input", () => {
    const result = alpha0.parse("hello");
    const expected = ["", "hello"] as const;
    assertEqualTypes<typeof result, typeof expected>();
    assertEquals(result, expected);
  });

  await t.step("partially consumed input", () => {
    const result = alpha0.parse("hello123world");
    const expected = ["123world", "hello"] as const;
    assertEqualTypes<typeof result, typeof expected>();
    assertEquals(result, expected);
  });

  await t.step("no consumable input", () => {
    const result = alpha0.parse("\n");
    const expected = ["\n", ""] as const;
    assertEqualTypes<typeof result, typeof expected>();
    assertEquals(result, expected);
  });

  await t.step("empty input", () => {
    const result = alpha0.parse("");
    const expected = ["", ""] as const;
    assertEqualTypes<typeof result, typeof expected>();
    assertEquals(result, expected);
  });

  await t.step("non-exact string types", () => {
    const result = alpha0.parse("" as string);
    assertEqualTypes<typeof result, readonly [string, string]>();
  });
});

Deno.test("character/alpha1", async (t) => {
  await t.step("fully consumed input", () => {
    const result = alpha1.parse("hello");
    const expected = ["", "hello"] as const;
    assertEqualTypes<typeof result, typeof expected>();
    assertEquals(result, expected);
  });

  await t.step("partially consumed input", () => {
    const result = alpha1.parse("hello123world");
    const expected = ["123world", "hello"] as const;
    assertEqualTypes<typeof result, typeof expected>();
    assertEquals(result, expected);
  });

  await t.step("empty input fails", () => {
    assertThrows(() => {
      const result = alpha1.parse("");
      assertEqualTypes<typeof result, never>();
    });
  });

  await t.step("no consumable input fails", () => {
    assertThrows(() => {
      const result = alpha1.parse("\n");
      assertEqualTypes<typeof result, never>();
    });
  });

  await t.step("non-exact string types", () => {
    const result = alpha1.parse("a" as string);
    assertEqualTypes<typeof result, readonly [string, string]>();
  });
});
