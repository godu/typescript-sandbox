/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/naming-convention */

import type * as Functor from 'fp-ts/lib/Functor';

declare module 'fp-ts/lib/HKT' {
	interface URItoKind2<E, A> {
		ListF: ListF<E, A>;
	}
}

export type ListF<A, B> = undefined | [A, B];

export const URI = 'ListF';
export type URI = typeof URI;

const _map = <E, A, B>(fa: ListF<E, A>, f: (a: A) => B): ListF<E, B> => {
	if (fa === undefined) {
		return undefined;
	}

	const [e, a] = fa;
	return [e, f(a)];
};

export const Functor2: Functor.Functor2<URI> = {
	URI,
	map: _map,
};

export const embed = <A>(fa: ListF<A, A[]>): A[] => {
	if (fa === undefined) {
		return [];
	}

	const [a, b] = fa;
	return [a, ...b];
};

export const project = <A>(a: A[]): ListF<A[], A[]> => {
	if (a.length === 0) {
		return undefined;
	}

	const [head, ...tail] = a;
	return [[head], tail];
};
