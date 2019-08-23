import * as Lazy from './lazy';

type Async<A> = Lazy.Lazy<Promise<A>>;

export function async<A>(a: A): Async<A> {
    return Lazy.lazy(Promise.resolve(a));
}
export function force<A>(ma: Async<A>): Promise<A> {
    return Lazy.force(ma);
}
export function map<A, B>(f: (a: A) => B, ma: Async<A>): Async<B> {
    return () => force(ma).then(f)
};