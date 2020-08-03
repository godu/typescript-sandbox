import test from 'ava';
import { noop } from 'lodash/fp';
import { Lazy, force, map, flatMap, of } from '../../src/data/functor/lazy';
// import { Lazy, force, map, flatMap, of } from '../src/functor/lazyWithEq';

const throw_ = (message?: string) => { throw new Error(message) };
test('if keyword', t => {
  t.true(true ? true : false);
  t.false(false ? true : false);

  t.notThrows(() => true ? noop() : throw_());
  t.throws(() => false ? noop() : throw_());
});

const true_ = <A>(x: A, y: A): A => x;
const false_ = <A>(x: A, y: A): A => y;

const if_ = <A>(
  cond_: (a: A, b: A) => A,
  then_: A,
  else_: A
): A => cond_(then_, else_);

test('if function', t => {
  t.true(if_(true_, true, false))
  t.false(if_(false_, true, false))

  t.throws(() => if_(true_, noop(), throw_()));
  t.throws(() => if_(false_, noop(), throw_()));

  const lazyThrow = map(throw_, of(void 0));
  const lazyNoop = map(noop, of(void 0));;
  t.notThrows(() => force(if_(true_, lazyNoop, lazyThrow)));
  t.throws(() => force(if_(false_, lazyNoop, lazyThrow)));
});

test('tree shacking', t => {
  const task = (ma: Lazy<number>): Lazy<number> => {
    const isEven = map(a => a % 2 === 0 ? true_ : false_, ma);

    const hugeNumber: Lazy<number> = map(() => {
      throw new Error('Timeout');
      // while(true) {}
    }, of(void 0));

    return flatMap(isEven => if_(isEven, ma, hugeNumber), isEven);
  }

  t.notThrows(() => force(task(of(2))));
  t.throws(() => force(task(of(1))), { message: 'Timeout' });
});
