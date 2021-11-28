import { alpha1, delimited, many0, multispace0, pair, tag, many1 } from "../mod.ts";
import { assertAlwaysEqual, assertEqualTypes } from "../test_deps.ts";

Deno.test("multi/many0", async (t) => {
  const colonSepParser = many0(delimited(tag(":"), alpha1, tag(":")));
  await t.step("basic", () => {
    {
      const result = colonSepParser.parse(":hey::how::are::you:");
      assertAlwaysEqual(
        result,
        ["", ["hey", "how", "are", "you"]] as const,
      );
    }

    {
      const result = colonSepParser.parse(":hey::how::are::you:exits scene");
      assertAlwaysEqual(
        result,
        ["exits scene", ["hey", "how", "are", "you"]] as const,
      );
    }
  });

  await t.step("never fails", () => {
    {
      const result = colonSepParser.parse("asdf");
      assertAlwaysEqual(result, ["asdf", []] as const);
    }

    {
      const result = colonSepParser.parse("");
      assertAlwaysEqual(result, ["", []] as const);
    }
  });

  await t.step("non-exact string types", () => {
    const parser = many0(
      delimited(multispace0, alpha1, pair(multispace0, tag(","))),
    );

    {
      const result = parser.parse("milk, chicken, eggs,");
      assertAlwaysEqual(result, ["", ["milk", "chicken", "eggs"]] as const);
    }

    {
      const result = parser.parse("milk, chicken, eggs," as string);
      assertEqualTypes<
        typeof result,
        readonly [
          string,
          readonly string[],
        ]
      >();
    }
  });
});

Deno.test("multi/many1", async (t) => {
  const colonSepParser = many0(delimited(tag(":"), alpha1, tag(":")));
  await t.step("basic", () => {
    {
      const result = colonSepParser.parse(":hey::how::are::you:");
      assertAlwaysEqual(
        result,
        ["", ["hey", "how", "are", "you"]] as const,
      );
    }

    {
      const result = colonSepParser.parse(":hey::how::are::you:exits scene");
      assertAlwaysEqual(
        result,
        ["exits scene", ["hey", "how", "are", "you"]] as const,
      );
    }
  });

  await t.step("never fails", () => {
    {
      const result = colonSepParser.parse("asdf");
      assertAlwaysEqual(result, ["asdf", []] as const);
    }

    {
      const result = colonSepParser.parse("");
      assertAlwaysEqual(result, ["", []] as const);
    }
  });

  await t.step("non-exact string types", () => {
    const parser = many0(
      delimited(multispace0, alpha1, pair(multispace0, tag(","))),
    );

    {
      const result = parser.parse("milk, chicken, eggs,");
      assertAlwaysEqual(result, ["", ["milk", "chicken", "eggs"]] as const);
    }

    {
      const result = parser.parse("milk, chicken, eggs," as string);
      assertEqualTypes<
        typeof result,
        readonly [
          string,
          readonly string[],
        ]
      >();
    }
  });
});
