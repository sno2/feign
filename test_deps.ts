import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.115.1/testing/asserts.ts";

export { assertEquals, assertThrows };

export type Equals<X, Y> = [X, Y] extends [Y, X] ? true : false;

const assertSymb = Symbol();

export function assertEqualTypes<T, F>(
  ..._params: true extends Equals<T, F> ? [] : [failed: typeof assertSymb]
) {}

/**
 * Checks if `a` and `b` are equal types at compile-time and equal values at
 * runtime
 */
export function assertAlwaysEqual<T, F>(
  a: T,
  b: F,
  ..._checker: true extends Equals<T, F> ? [] : [failed: typeof assertSymb]
): void {
  assertEquals(a, b);
}
