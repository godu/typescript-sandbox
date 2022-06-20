import { Lazy, of, map, force } from "./data/functor/lazy";

export const fix = <A>(rec: (a: Lazy<A>) => A): A => {
  let x: Lazy<A> = () => rec(x);
  return force(x);
};

function Y<A>(f: (a: A) => A): (a: A) => A {
  var g = f(
    // @ts-ignore
    (function (h) {
      return function (n: A) {
        // @ts-ignore
        var g = f(h(h));
        // @ts-ignore
        return g(n);
      };
      // @ts-ignore
    })(function (h) {
      return function () {
        var g = f(h(h));
        // @ts-ignore
        return g(n);
      };
    })
  );
  // @ts-ignore
  return g;
}

var fac = Y((f: (n: number) => number) => (n: number): number => {
  console.log("fac", n);
  return n > 1 ? n * f(n - 1) : 1;
});
