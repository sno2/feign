import { digit0, digit1 } from "./digit.ts";
import { assertEquals, assertEqualTypes, assertThrows } from "../test_deps.ts";

Deno.test("character/digit0", async (t) => {
  await t.step("basic", () => {
    const data = digit0.parse(
      "123world",
    );
    const expected = ["world", "123"] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });

  await t.step("empty input", () => {
    const data = digit0.parse("");
    const expected = ["", ""] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });

  await t.step("non-exact string types", () => {
    const data = digit0.parse("" as string);
    assertEqualTypes<typeof data, readonly [string, string]>();
  });

  await t.step("trailing digits", () => {
    const data = digit0.parse(
      "234a123",
    );
    const expected = ["a123", "234"] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });

  await t.step("intermittent whitespace", () => {
    const data = digit0.parse(
      "123\n1234\n",
    );
    const expected = ["\n1234\n", "123"] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });

  await t.step("no consumed digits", () => {
    const data = digit0.parse("hello");
    const expected = ["hello", ""] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });
});

Deno.test("character/digit1", async (t) => {
  await t.step("basic", () => {
    const data = digit1.parse(
      "123world",
    );
    const expected = ["world", "123"] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });

  await t.step("non-exact string types", () => {
    const data = digit1.parse("1" as string);
    assertEqualTypes<typeof data, readonly [string, string]>();
  });

  await t.step("trailing digits", () => {
    const data = digit1.parse(
      "234a123",
    );
    const expected = ["a123", "234"] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });

  await t.step("intermittent whitespace", () => {
    const data = digit1.parse(
      "123\n1234\n",
    );
    const expected = ["\n1234\n", "123"] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });

  await t.step("no consumed digits fails", () => {
    assertThrows(() => {
      const data = digit1.parse("hello");
      assertEqualTypes<typeof data, never>();
    });
  });

  await t.step("empty input fails", () => {
    assertThrows(() => {
      const data = digit1.parse("");
      assertEqualTypes<typeof data, never>();
    });
  });
});
