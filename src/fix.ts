import { Lazy, of, map, force } from "./data/functor/lazy";

export const fix = <A>(rec: (a: Lazy<A>) => A): A => {
    let x: Lazy<A> = () => rec(x);
    return force(x);
};
