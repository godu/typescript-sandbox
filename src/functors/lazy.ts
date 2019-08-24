export type Lazy<A> = () => A;

export function of<A>(value: A): Lazy<A> {
    return () => value;
}

export function force<A>(ma: Lazy<A>): A {
    return ma();
}

export function map<A, B>(f: (a: A) => B, ma: Lazy<A>): Lazy<B> {
    return () => f(force(ma))
};
