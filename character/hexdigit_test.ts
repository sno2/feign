import { hexdigit0, hexdigit1 } from "../mod.ts";
import {
  assertAlwaysEqual,
  assertEqualTypes,
  assertThrows,
} from "../test_deps.ts";

Deno.test("character/hexdigit0", async (t) => {
  await t.step("fully consumed input", () => {
    const result = hexdigit0.parse("a3fd");
    assertAlwaysEqual(result, ["", "a3fd"] as const);
  });

  await t.step("partially consumed input", () => {
    const result = hexdigit0.parse("a3fdSTOP");
    assertAlwaysEqual(result, ["STOP", "a3fd"] as const);
  });

  await t.step("no consumed input", () => {
    const result = hexdigit0.parse("STOP");
    assertAlwaysEqual(result, ["STOP", ""] as const);
  });

  await t.step("no input", () => {
    const result = hexdigit0.parse("");
    assertAlwaysEqual(result, ["", ""] as const);
  });

  await t.step("non-exact string type", () => {
    const result = hexdigit0.parse("" as string);
    assertEqualTypes<typeof result, readonly [string, string]>();
  });
});

Deno.test("character/hexdigit1", async (t) => {
  await t.step("fully consumed input", () => {
    const result = hexdigit1.parse("a3fd");
    assertAlwaysEqual(result, ["", "a3fd"] as const);
  });

  await t.step("partially consumed input", () => {
    const result = hexdigit1.parse("a3fdSTOP");
    assertAlwaysEqual(result, ["STOP", "a3fd"] as const);
  });

  await t.step("invalid input", async (t) => {
    await t.step("no consumed input", () => {
      assertThrows(() => {
        const result = hexdigit1.parse("STOP");
        assertEqualTypes<typeof result, never>();
      });
    });

    await t.step("no input", () => {
      assertThrows(() => {
        const result = hexdigit1.parse("");
        assertEqualTypes<typeof result, never>();
      });
    });
  });

  await t.step("non-exact string type", () => {
    const result = hexdigit1.parse("2" as string);
    assertEqualTypes<typeof result, readonly [string, string]>();
  });
});
