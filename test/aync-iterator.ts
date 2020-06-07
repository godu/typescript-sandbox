import test from 'ava';
import { pipe } from 'lodash/fp';
import { of, toArray, toPromise, map, take, drop, fold } from '../src/async-iterator';

test('of', async t => {
    const input = [0, 1, 2, 3, 4];

    const expected = [...input];
    for await (const actual of of(input)) {
        t.is(actual, expected.shift())
    }
});

test('toArray', async t => {
    const input = [0, 1, 2, 3, 4];

    t.deepEqual(await toArray(of(input)), input)

    const generator = async function* () {
        yield 0;
        yield 1;
        return 2;
    };
    t.deepEqual(await toArray(generator()), [0, 1])
    const failedGenerator = async function* () {
        yield 0;
        throw new Error('Misterious error');
    }
    await t.throwsAsync(toArray(failedGenerator()), {message: 'Misterious error'});
});

test('map', async t => {
    const input = [0, 1, 2, 3, 4];

    t.deepEqual(
        await pipe(of, map((x: number) => x * x), toArray)(input),
        [0, 1, 4, 9, 16]
    )
});

test('fold', async t => {
    const input = [0, 1, 2, 3, 4];

    t.deepEqual(
        await pipe(of, fold((a: number, acc: number) => a + acc, 0), toPromise)(input),
        10
    )

    await t.throwsAsync(
        toPromise(of([])),
        {message: 'No value'}
    )
});

test('take', async t => {
    const input = [0, 1, 2, 3, 4];
    
    t.deepEqual(
        await pipe(of, take(3), toArray)(input),
        [0, 1, 2]
    )
    t.deepEqual(
        await pipe(of, take(10), toArray)(input),
        input
    )
});

test('drop', async t => {
    const input = [0, 1, 2, 3, 4];
    
    t.deepEqual(
        await pipe(of, drop(-1), toArray)(input),
        [0, 1, 2, 3, 4]
    )
    t.deepEqual(
        await pipe(of, drop(3), toArray)(input),
        [3, 4]
    )
    t.deepEqual(
        await pipe(of, drop(10), toArray)(input),
        []
    )
});
