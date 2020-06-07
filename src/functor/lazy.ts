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

export function ap<A, B, C>(f: (a: A) => (b: B) => C, ma: Lazy<A>, mb: Lazy<B>): Lazy<C> {
    return () => f(force(ma))(force(mb));
};

export function flatMap<A, B>(f: (a: A) => Lazy<B>, ma: Lazy<A>): Lazy<B> {
    return () => force(f(force(ma)));
}
