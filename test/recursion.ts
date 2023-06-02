import test from 'ava';
import {take} from '../src/iterable.js';

const fix = <A, B>(f: (a: (a: A) => B) => (a: A) => B): (a: A) => B => f(a => fix(f)(a));

const fac = fix((f: (n: number) => number) => (n: number) => n > 1 ? n * f(n - 1) : 1);

test('fac(5) = 120', t => {
	t.is(fac(5), 120);
});

const replicate = fix<number, <A>(a: A) => A[]>(
	rec => n => a => n === 0 ? [] : [a, ...rec(n - 1)(a)]);

test('replicate', t => {
	t.deepEqual(replicate(3)(5), [5, 5, 5]);
});

const natural = fix<number, Iterable<number>>(
	rec => (n: number) => ({
		* [Symbol.iterator]() {
			yield n;
			yield * rec(n + 1);
		},
	}))(0);

test('natural', t => {
	t.deepEqual([...take(3)(natural)], [0, 1, 2]);
	t.deepEqual([...take(5)(natural)], [0, 1, 2, 3, 4]);
});
