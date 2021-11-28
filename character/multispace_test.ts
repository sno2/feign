import { multispace0, multispace1 } from "./multispace.ts";
import { assertEquals, assertEqualTypes, assertThrows } from "../test_deps.ts";

Deno.test("character/multispace0", async (t) => {
  await t.step("basic", () => {
    const data = multispace0.parse(
      "\n\r   \thelloworld",
    );
    const expected = ["helloworld", "\n\r   \t"] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });

  await t.step("empty input", () => {
    const data = multispace0.parse("");
    const expected = ["", ""] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });

  await t.step("non-exact string types", () => {
    const data = multispace0.parse("" as string);
    assertEqualTypes<typeof data, readonly [string, string]>();
  });

  await t.step("trailing whitespace", () => {
    const data = multispace0.parse(
      "\n\r   \thelloworld\n",
    );
    const expected = ["helloworld\n", "\n\r   \t"] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });

  await t.step("intermittent whitespace", () => {
    const data = multispace0.parse(
      "\n\r   \thello\tworld\n",
    );
    const expected = ["hello\tworld\n", "\n\r   \t"] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });

  await t.step("no consumed whitespace", () => {
    const data = multispace0.parse("hello");
    const expected = ["hello", ""] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });
});

Deno.test("character/multispace1", async (t) => {
  await t.step("basic", () => {
    const data = multispace1.parse(
      "\n\r   \thelloworld",
    );
    const expected = ["helloworld", "\n\r   \t"] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });

  await t.step("non-exact string types", () => {
    const data = multispace1.parse(" " as string);
    assertEqualTypes<typeof data, readonly [string, string]>();
  });

  await t.step("trailing whitespace", () => {
    const data = multispace1.parse(
      "\n\r   \thelloworld\n",
    );
    const expected = ["helloworld\n", "\n\r   \t"] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });

  await t.step("intermittent whitespace", () => {
    const data = multispace1.parse(
      "\n\r   \thello\tworld\n",
    );
    const expected = ["hello\tworld\n", "\n\r   \t"] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });

  await t.step("no consumable whitespace fails", () => {
    assertThrows(() => {
      const data = multispace1.parse("");
      assertEqualTypes<typeof data, never>();
    });

    assertThrows(() => {
      const data = multispace1.parse("f\n\t");
      assertEqualTypes<typeof data, never>();
    });
  });
});
