import test from "ava";
import { force, map, of, ap, flatMap } from "../../../src/data/functor/lazy";
import { add, identity } from "ramda";

test("of", (t) => {
  const a = of(3);
  const b = of(3);

  t.notDeepEqual(a, b);
});

test("force", (t) => {
  const a = of(3);

  t.deepEqual(force(a), 3);
});

test("map", (t) => {
  const add2 = add(2);

  const a = of(3);
  const a_ = map(add2, a);

  t.is(force(a_), 5);

  const b = of(3);
  const b_ = map(add2, b);

  t.notDeepEqual(a_, b_);
});

test("ap", (t) => {
  const a = of(3);
  const b = of(3);

  const add_: (a: number) => (b: number) => number = add;

  const ab = ap(add_, a, b);

  t.is(force(ab), 6);

  const ab_ = ap(add_, a, b);
  t.notDeepEqual(ab, ab_);

  t.is(add_(1)(2), force(ap(add_, of(1), of(2))));
});

test("flatMap", (t) => {
  const a = of(of(3));
  const b = of(3);

  const a_ = flatMap(identity as <A>(a: A) => A, a);
  t.notDeepEqual(a_, b);

  t.is(force(a_), 3);
});
