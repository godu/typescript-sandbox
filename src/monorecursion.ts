/* eslint-disable unicorn/no-array-method-this-argument */
/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable @typescript-eslint/no-redeclare */
import {type Functor2} from 'fp-ts/lib/Functor';
import {type Kind2, type URIS2} from 'fp-ts/lib/HKT';
import {pipe} from 'fp-ts/lib/function';

export const fix = <A, B>(f: (rec: (a: A) => B) => (a: A) => B): (a: A) => B => f(a => fix(f)(a));

export const hylo = <F extends URIS2>(F: Functor2<F>) =>
	<A, B>(f: (fb: Kind2<F, A, B>) => B, g: (a: A) => Kind2<F, A, A>) =>
		(a: A): B =>
			pipe(a, g, fa => F.map(fa, hylo(F)(f, g)), f);
