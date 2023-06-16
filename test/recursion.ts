
import test from 'ava';
import {take} from '../src/iterable.js';
import {fix, hylo} from '../src/monorecursion.js';
import * as ListF from '../src/data/listf.js';
import * as TreeF from '../src/data/treef.js';

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

const factorial = hylo(ListF.Functor2)<number, number>(
	xs => {
		if (xs === undefined) {
			return 1;
		}

		const [head, tail] = xs;
		return head * tail;
	},
	n => {
		if (n === 0) {
			return undefined;
		}

		return [n, n - 1];
	},
);

test('factorial', t => {
	t.is(factorial(0), 1);
	t.is(factorial(1), 1);
	t.is(factorial(2), 2);
	t.is(factorial(3), 6);
	t.is(factorial(4), 24);
	t.is(factorial(5), 120);
	t.is(factorial(6), 720);
	t.is(factorial(7), 5040);
	t.is(factorial(8), 40_320);
	t.is(factorial(9), 362_880);
	t.is(factorial(10), 3_628_800);
	t.is(factorial(11), 39_916_800);
	t.is(factorial(12), 479_001_600);
	t.is(factorial(13), 6_227_020_800);
	t.is(factorial(14), 87_178_291_200);
	t.is(factorial(15), 1_307_674_368_000);
	t.is(factorial(16), 20_922_789_888_000);
	t.is(factorial(17), 355_687_428_096_000);
	t.is(factorial(18), 6_402_373_705_728_000);
	t.is(factorial(19), 121_645_100_408_832_000);
	t.is(factorial(20), 2_432_902_008_176_640_000);
});

const fibonacci = hylo(TreeF.Functor2)<number, number>(
	fa => {
		const [a, as] = fa;
		return as.reduce((acc, a) => acc + a, a);
	},
	n => {
		if (n === 0) {
			return [0, []];
		}

		if (n === 1) {
			return [1, []];
		}

		return [0, [n - 2, n - 1]];
	},
);

test('fibonacci', t => {
	t.is(fibonacci(0), 0);
	t.is(fibonacci(1), 1);
	t.is(fibonacci(2), 1);
	t.is(fibonacci(3), 2);
	t.is(fibonacci(4), 3);
	t.is(fibonacci(5), 5);
	t.is(fibonacci(6), 8);
	t.is(fibonacci(7), 13);
	t.is(fibonacci(8), 21);
	t.is(fibonacci(9), 34);
	t.is(fibonacci(10), 55);
	t.is(fibonacci(11), 89);
	t.is(fibonacci(12), 144);
	t.is(fibonacci(13), 233);
	t.is(fibonacci(14), 377);
	t.is(fibonacci(15), 610);
	t.is(fibonacci(16), 987);
	t.is(fibonacci(17), 1597);
	t.is(fibonacci(18), 2584);
	t.is(fibonacci(19), 4181);
	t.is(fibonacci(20), 6765);
});
