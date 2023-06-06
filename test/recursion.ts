import test from 'ava';
import {take} from '../src/iterable.js';

const fix = <A, B>(f: (a: (a: A) => B) => (a: A) => B): (a: A) => B => f(a => fix(f)(a));

const fac = fix((f: (n: number) => number) => (n: number) => n > 1 ? n * f(n - 1) : 1);

test('fac', t => {
	t.is(fac(5), 120);
});

const replicate = fix<number, <A>(a: A) => A[]>(
	rec => n => a => n === 0 ? [] : [a, ...rec(n - 1)(a)]);

test('replicate', t => {
	t.deepEqual(replicate(3)(5), [5, 5, 5]);
});

const sum = fix<number[], number>(
	rec => xs => {
		if (xs.length === 0) {
			return 0;
		}

		const [head, ...tail] = xs;
		return head + rec(tail);
	});

test('sum', t => {
	t.is(sum([1, 3, 9]), 13);
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

type Tree<T> = [T] | [Tree<T>, Tree<T>];

const pipe = <A, B, C>(f: (a: A) => B, g: (b: B) => C): ((a: A) => C) => a => g(f(a));

const fibonacci = pipe<number, Tree<number>, number>(
	fix<number, Tree<number>>(rec => n => (n === 0) ? [0] : ((n === 1) ? [1] : [rec(n - 2), rec(n - 1)])),
	fix<Tree<number>, number>(rec => n => n.length === 1 ? n[0] : rec(n[0]) + rec(n[1])),
);

test('fibonacci', t => {
	t.is(fibonacci(0), 0);
	t.is(fibonacci(1), 1);
	t.is(fibonacci(2), 1);
	t.is(fibonacci(3), 2);
	t.is(fibonacci(4), 3);
});
