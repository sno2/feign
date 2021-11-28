import { alt } from "./alt.ts";
import { alpha1, digit1 } from "../mod.ts";
import {
  assertAlwaysEqual,
  assertEqualTypes,
  assertThrows,
} from "../test_deps.ts";

Deno.test("branch/alt", async (t) => {
  const parser = alt(alpha1, digit1);

  await t.step("valid input", () => {
    {
      const result = parser.parse("asdf");
      assertAlwaysEqual(result, ["", [0, "asdf"]] as const);
    }

    {
      const result = parser.parse("asdf23");
      assertAlwaysEqual(result, ["23", [0, "asdf"]] as const);
    }

    {
      const result = parser.parse("23asdf");
      assertAlwaysEqual(result, ["asdf", [1, "23"]] as const);
    }
  });

  await t.step("zero parsers throws", () => {
    assertThrows(() => {
      const parser = alt();
      assertEqualTypes<typeof parser, never>();
    });
  });

  await t.step("no parsers working throws", () => {
    assertThrows(() => {
      const result = parser.parse("?");
      assertEqualTypes<typeof result, never>();
    });

    assertThrows(() => {
      const result = parser.parse("_asdf");
      assertEqualTypes<typeof result, never>();
    });
  });

  await t.step("non-exact string type signature", () => {
    {
      const result = parser.parse("a" as string);
      assertEqualTypes<
        typeof result,
        readonly [string, readonly [0, string] | readonly [1, string]]
      >();
    }
  });
});
