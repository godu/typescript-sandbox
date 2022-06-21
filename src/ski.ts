// https://www.youtube.com/watch?v=Yy0UM5nAl5c

export type S = "S";
export type K = "K";
export type I = "I";
export type App = ["App", Ski, Ski];
export type Ski = S | K | I | App;

export const S: S = "S";
export const K: K = "K";
export const I: I = "I";
export const App = (f: Ski, x: Ski): App => ["App", f, x];

const isApp = (x: Ski): x is App => Array.isArray(x);

export const evaluate = (x: Ski): Ski => {
  if (isApp(x)) {
    const [, f, y] = x;
    if (f === I) return evaluate(y);
    if (f === K) return App(f, evaluate(y));
    if (isApp(f)) {
      const [, g, z] = f;
      if (g === K) return evaluate(z);
      if (isApp(g)) {
        const [, i, a] = g;
        if (i === S) return evaluate(App(App(a, y), App(z, y)));
      }
    }
    return evaluate(App(evaluate(f), y));
  }
  return x;
};
