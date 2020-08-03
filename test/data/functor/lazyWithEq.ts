import test from 'ava';
import { force, map, of, ap, flatMap } from '../../../src/data/functor/lazyWithEq';
import { add, identity } from 'lodash/fp';

test('of', t => {
  const a = of(3);
  const b = of(3);

  t.deepEqual(a, b);
});

test('force', t => {
  const a = of(3);

  t.deepEqual(force(a), 3);
});

test('map', t => {
  const add2 = add(2);

  const a = of(3);
  const a_ = map(add2, a);

  t.is(force(a_), 5)

  const b = of(3);
  const b_ = map(add2, b);

  t.deepEqual(a_, b_);
});

test('ap', t => {
  const a = of(3);
  const b = of(3);

  const ab = ap(add, a, b);

  t.is(force(ab), 6)

  const ab_ = ap(add, a, b);
  t.deepEqual(ab, ab_);
});

test('flatMap', t => {
  const a = of(of(3));
  const b = of(3);

  const a_ = flatMap(identity as <A>(a: A) => A, a);
  t.notDeepEqual(a_, b);

  t.is(force(a_), 3)
});
