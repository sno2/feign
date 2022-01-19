import {
  alpha0,
  alpha1,
  alt,
  digit0,
  joiner,
  many0,
  many1,
  oneOf,
  tuple,
} from "../mod.ts";

const identifierParser = joiner(tuple(
  oneOf("_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"),
  many0(
    oneOf("_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"),
  ),
));

identifierParser.parse("world");
identifierParser.parse("hello123");
console.log(identifierParser.parse("a12"));
