export function of<A>(value: A): Array<A> {
    return [value];
}

export function map<A, B>(f: (a: A) => B, ma: Array<A>): Array<B> {
    return ma.map(f);
}
