export function of<A>(value: A): Promise<A> {
    return Promise.resolve(value);
}

export function map<A, B>(f: (a: A) => B, ma: Promise<A>): Promise<B> {
    return ma.then(f);
}
