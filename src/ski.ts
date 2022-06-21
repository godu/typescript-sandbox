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

const isEqual = (a: Ski, b: Ski): boolean => {
  if (isApp(a) && isApp(b)) return isEqual(a[1], b[1]) && isEqual(a[2], b[2]);
  return a === b;
};

export const evaluate = (x: Ski): Ski => {
  if (isApp(x)) {
    if (isApp(x[1]) && x[1][1] === K) return evaluate(x[1][2]);
    if (isApp(x[1]) && isApp(x[1][1]) && x[1][1][1] === S)
      return evaluate(App(App(x[1][1][2], x[2]), App(x[1][2], x[2])));
    if (x[1] === I) return evaluate(x[2]);
    if (x[1] === K) return App(K, evaluate(x[2]));

    const y = evaluate(x[1]);
    if (isEqual(x[1], y)) return App(y, x[2]);
    return evaluate(App(y, x[2]));
  }
  return x;
};
