/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/naming-convention */

import type * as Functor from 'fp-ts/lib/Functor';

declare module 'fp-ts/lib/HKT' {
	interface URItoKind2<E, A> {
		TreeF: TreeF<E, A>;
	}
}

export type TreeF<A, B> = [A, B[]];

export const URI = 'TreeF';
export type URI = typeof URI;

const _map = <E, A, B>(fa: TreeF<E, A>, f: (a: A) => B): TreeF<E, B> => {
	const [e, as] = fa;
	return [e, as.map(a => f(a))];
};

export const Functor2: Functor.Functor2<URI> = {
	URI,
	map: _map,
};
