import test from "ava";
import { pipe, range } from "ramda";
import * as Iterable from "../../src/data/functor/iterable";
import { bench } from "../helpers/bench";

const input = range(0)(100);
const expected = 475252470;

test(
  "transducer with iterable",
  bench(100),
  pipe(
    Iterable.map((x: number) => x * x),
    Iterable.filter((x: number) => x % 2 === 0),
    Iterable.flatMap((x: number) => range(0)(x)),
    Iterable.fold((x: number, acc: number) => x + acc, 0)
  ),
  [input],
  expected
);

const Array = {
  map:
    <A, B>(f: (a: A) => B) =>
    (a: A[]): B[] =>
      a.map(f),
  filter:
    <A>(f: (a: A) => boolean) =>
    (a: A[]): A[] =>
      a.filter(f),
  flatMap:
    <A, B>(f: (a: A) => B[]) =>
    (a: A[]): B[] =>
      a.flatMap(f),
  reduce:
    <A, B>(f: (b: B, a: A) => B, b: B) =>
    (a: A[]): B =>
      a.reduce(f, b),
};

test(
  "transducer with array",
  bench(100),
  pipe(
    Array.map((x: number) => x * x),
    Array.filter((x: number) => x % 2 === 0),
    Array.flatMap((x: number) => range(0)(x)),
    Array.reduce((x: number, acc: number) => x + acc, 0)
  ),
  [input],
  expected
);
