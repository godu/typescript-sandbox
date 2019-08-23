export type Identity<A> = A;

export function identity<A>(value: A) {
    return value;
}

export function map<A, B>(f: (a: A) => B, ma: Identity<A>) {
    return identity(f(ma));
}
