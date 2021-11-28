import { alpha0, alpha1, alt, digit0, many0, oneOf, tuple } from "../mod.ts";

const identifierParser = tuple(
  alt(alpha1, oneOf("_")),
  many0(alt(alpha0, digit0, oneOf("_"))),
);

identifierParser.parse("_world");
identifierParser.parse("hello123");
identifierParser.parse("hello123_");
