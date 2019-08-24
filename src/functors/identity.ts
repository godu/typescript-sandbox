export type Identity<A> = A;

export function of<A>(value: A) {
    return value;
}

export function map<A, B>(f: (a: A) => B, ma: Identity<A>) {
    return of(f(ma));
}
