import test, { Macro } from 'ava';
import { fix } from '../src/fix';
import { constant } from 'lodash/fp'
import { force, Lazy } from '../src/data/functor/lazy';


const macro = <A>(): Macro<[Lazy<A>, A]> => (t, actual, expected) => {
    t.deepEqual(force(actual), expected);
}

const factorial = fix<(a: number) => number>(
    rec =>
        n =>
            (n <= 1) ? 1 : n * force(rec)(n - 1)
);
test('factorial(5)', macro(),
    () => factorial(5),
    120
);

test('constant("hello, haskell")', macro(),
    () => fix(constant("hello, haskell")),
    "hello, haskell"
)

const repeat = <T>(n: T) => fix<(i: number) => T[]>(
    rec =>
        i =>
            i <= 0 ? [] : [n, ...(force(rec)(i - 1))]
)
test('repeat("foo")(5)', macro(),
    () => repeat('foo')(5),
    ['foo', 'foo', 'foo', 'foo', 'foo']
)
test('repeat(42)(2)', macro(),
    () => repeat(42)(2),
    [42, 42]
)
