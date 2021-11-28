import { alpha1, map, multispace1, opt, preceded, tuple } from "../mod.ts";
import { assertEquals, assertEqualTypes } from "../test_deps.ts";

Deno.test("comb/map", async (t) => {
  const nameParser = map(
    tuple(
      alpha1,
      preceded(multispace1, alpha1),
      opt(preceded(multispace1, alpha1)),
    ),
    ([firstName, middleName, lastName]) => (
      {
        firstName,
        middleName: lastName === null ? null : middleName,
        lastName: lastName ?? middleName,
      }
    ),
  );

  assertEquals(nameParser.parse("jon doe"), ["", {
    firstName: "jon",
    middleName: null,
    lastName: "doe",
  }]);

  assertEquals(nameParser.parse("jon doe dale"), ["", {
    firstName: "jon",
    middleName: "doe",
    lastName: "dale",
  }]);

  assertEquals(nameParser.parse("jon doe dale123"), ["123", {
    firstName: "jon",
    middleName: "doe",
    lastName: "dale",
  }]);

  await t.step("non-exact string input", () => {
    const result = nameParser.parse("jon doe" as string);
    assertEqualTypes<
      typeof result,
      readonly [
        string,
        { firstName: string; middleName: string | null; lastName: string },
      ]
    >();
  });
});
