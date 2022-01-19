import { joiner } from "./joiner.ts";
import { many1 } from "./many.ts";
import { oneOf } from "../character/one_of.ts";
import { assertEquals } from "../test_deps.ts";
import { tag } from "../tag.ts";
import { preceded } from "../sequence/preceded.ts";

Deno.test("multi/joiner", async (t) => {
  await t.step("basic", () => {
    const parser = joiner(many1(oneOf("_abc")));
    assertEquals(parser.parse(" _a_b"), [" _a_b", ""]);
    assertEquals(parser.parse("_a_b world"), [" world", "_a_b"]);
  });

  await t.step("nesting", () => {
    const parser = preceded(tag("start"), joiner(many1(oneOf("_abc"))));
    assertEquals(parser.parse("startabc_ "), [" ", "abc_"]);
  });
});
