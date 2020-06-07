import { identity } from "lodash/fp";

export type Lazy<A> = [(...args: any[]) => A, any[]];

const lazy = <A, T extends (...args: any) => A>(
    f: T,
    ...args: Parameters<T>
): Lazy<A> => [f, args];

export function of<A>(value: A): Lazy<A> {
    return lazy<A, (value: A) => A>(identity, value);
}

export function force<A>([f, args]: Lazy<A>): A {
    return f(...args);
}

const map_ = <A, B>(f: (a: A) => B, ma: Lazy<A>): B => {
    const a = force(ma);
    return f(a);
}
export function map<A, B>(f: (a: A) => B, ma: Lazy<A>): Lazy<B> {
    return lazy<B, (f: (a: A) => B, ma: Lazy<A>) => B>(map_, f, ma);
};

const ap_ = <A, B, C>(f: (a: A) => (b: B) => C, ma: Lazy<A>, mb: Lazy<B>): C => {
    const a = force(ma);
    const b = force(mb);
    return f(a)(b);
}
export function ap<A, B, C>(f: (a: A) =>(b: B) => C, ma: Lazy<A>, mb: Lazy<B>): Lazy<C> {
    return lazy<C, (f: (a: A) => (b: B) => C, ma: Lazy<A>, mb: Lazy<B>) => C>(ap_, f, ma, mb);
};

const flatMap_ = <A, B>(f: (a: A) => Lazy<B>, ma: Lazy<A>): B => {
    const a = force(ma);
    const mb = f(a);
    return force(mb);
} 
export function flatMap<A, B>(f: (a: A) => Lazy<B>, ma: Lazy<A>) {
    return lazy<B, (f: (a: A) => Lazy<B>, ma: Lazy<A>) => B>(flatMap_, f, ma);
}
