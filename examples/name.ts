import { alpha1, opt, tuple } from "../mod.ts";

const parser = opt(tuple(alpha1));
console.log(parser.parse("hello"));
