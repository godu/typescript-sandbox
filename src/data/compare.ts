export type Ordering = -1 | 0 | 1;

export type Compare<A> = (a: A, b: A) => Ordering

export const sortBy = <A>(compare: Compare<A>) =>
    (xs: Array<A>): Array<A> =>
        xs.sort(compare);

export const numberCompare: Compare<number> = (a, b) => a < b ? -1 : a > b ? 1 : 0;
export const stringCompare: Compare<string> = (a, b) => a < b ? -1 : a > b ? 1 : 0;
export const booleanCompare: Compare<boolean> = (a, b) => a < b ? -1 : a > b ? 1 : 0;

export const inverse = <A>(fa: Compare<A>): Compare<A> => (a, b) => {
    const r = fa(a, b);
    return r === -1 ? 1 : r === 1 ? -1 : 0;
}

// Contravariance
export const contramap = <A, B>(fa: Compare<A>, f: (b: B) => A): Compare<B> => (a: B, b: B) => fa(f(a), f(b));

// Semigroup
export const concat = <A>(fa: Compare<A>, fb: Compare<A>): Compare<A> => (a: A, b: A) => {
    const r = fa(a, b);
    return r === 0 ? fb(a, b) : r;
}

// Monoid
export const empty = <A>(a: A, b: A): Ordering => 0;
