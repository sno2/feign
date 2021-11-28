import { alpha1, multispace1, preceded, tag, tuple } from "../mod.ts";
import { assertEquals, assertEqualTypes, assertThrows } from "../test_deps.ts";

Deno.test("sequence/tuple", async (t) => {
  await t.step("fully consumed input", () => {
    const data = tuple(multispace1, alpha1, multispace1).parse("    foo   ");
    const expected = ["", ["    ", "foo", "   "]] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });

  await t.step("unconsumed input", () => {
    const data = tuple(multispace1).parse("\n    \thello world");
    const expected = ["hello world", ["\n    \t"]] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });

  await t.step("empty tuple", () => {
    const data = tuple().parse("    foo   ");
    const expected = ["    foo   ", []] as const;
    assertEqualTypes<typeof data, typeof expected>();
    assertEquals(data, expected);
  });

  await t.step("invalid input", () => {
    assertThrows(
      () => {
        const data = tuple(multispace1, alpha1, multispace1).parse("    foo");
        assertEqualTypes<typeof data, never>();
      },
      undefined,
      undefined,
      "The second 'multispace1' parser should fail.",
    );
  });

  await t.step("non-exact string type", () => {
    const result = tuple(alpha1, preceded(multispace1, alpha1)).parse(
      "Jon Doe" as string,
    );

    assertEqualTypes<
      typeof result,
      readonly [string, readonly [string, string]]
    >();
  });

  await t.step("nesting tuples", async (t) => {
    const parser = tuple(tuple(tag("hello"), tuple(multispace1)), alpha1);

    await t.step("fully consumed input", () => {
      const data = parser.parse("hello     world");
      const expected = ["", [["hello", ["     "]], "world"]] as const;
      assertEqualTypes<typeof data, typeof expected>();
      assertEquals(data, expected);
    });

    await t.step("unconsumed input", () => {
      const data = parser.parse("hello     world\n");
      const expected = ["\n", [["hello", ["     "]], "world"]] as const;
      assertEqualTypes<typeof data, typeof expected>();
      assertEquals(data, expected);
    });

    await t.step("invalid input", () => {
      assertThrows(() => {
        const data = parser.parse("hello");
        assertEqualTypes<typeof data, never>();
      });
    });
  });
});
