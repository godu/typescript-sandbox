/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/naming-convention */

import type * as Functor from 'fp-ts/lib/Functor';
import {type Kind2, type URIS2} from 'fp-ts/lib/HKT';

declare module 'fp-ts/lib/HKT' {
	interface URItoKind2<E, A> {
		TreeF: TreeF<E, A>;
	}
}

export type TreeF<A, B> = [A, B[]] | undefined;

export const URI = 'TreeF';
export type URI = typeof URI;

const _map = <E, A, B>(fa: TreeF<E, A>, f: (a: A) => B): TreeF<E, B> => {
	if (fa === undefined) {
		return undefined;
	}

	const [e, as] = fa;
	return [e, as.map(a => f(a))];
};

export const Functor2: Functor.Functor2<URI> = {
	URI,
	map: _map,
};

interface Recursive2<F extends URIS2, A> {
	readonly URI: F;
	readonly project: <E>(a: A) => Kind2<F, E, A>;
}

export const Recusive = <A extends unknown[]>(): Recursive2<URI, A> => ({
	URI,
	project<E>(as: A) {
		if (as.length === 0) {
			return undefined;
		}

		const [head, ...tail] = as;
		return [head, tail];
	},
});
