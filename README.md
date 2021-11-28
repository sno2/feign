# feign

A parser combinator for Deno with amazing compile-time string type parsing
support inspired by [Rust's `nom` crate](https://crates.io/crates/nom).

### 🚨 Deno Notice 🚨

You may get a `type is excessively large or infinite` error when using creating
complex parsers in Deno. This is due to the use of long recursion when utilizing
string parsing. However, this error will resolve once Deno updates its
TypeScript version to 4.5 with the introduction of
[tail-end elimination in TypeScript conditionals for recursive types](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta/#tailrec-conditional).
The TypeScript version upgrade is expected to be released with Deno 1.17. A
possible workaround is to abstract your parsers out into multiple parsers and
passing the inputs between each of them.

## Guide

### Usage

Import feign from Deno's Third Party Modules registry:

```ts no-run
import {} from "https://deno.land/x/feign/mod.ts";
```

### Examples

-

## Contributing

### Linting

Make sure you run the linter before pushing your code. We don't care about the
`no-explicit-any` rule as it is required to cast to `any` to have conditional
return types. Therefore, run the following command to lint the code:

```sh
$ deno lint --rules-exclude=no-explicit-any
```

### Building Utilities

Make sure you add proper tests for both valid and invalid inputs along with
including conditions such as when the input is a regular `string` type to ensure
correct behavior.

### Testing

We use the unstable built-in test nesting API for our tests so make sure you run
`deno test` with the `--unstable` flag:

```sh
$ deno test --unstable
```

### Codebase Notes

- Always return either `never` or an extension of `[string, any]` inside of
  parser helper types or you will break a lot of code.

## License

[MIT](./LICENSE)
