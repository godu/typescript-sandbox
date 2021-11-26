export type Ordering = -1 | 0 | 1;

export type Compare<A> = (a: A, b: A) => Ordering;

export const sortBy =
  <A>(compare: Compare<A>) =>
  (xs: Array<A>): Array<A> =>
    xs.sort(compare);

export const numberCompare: Compare<number> = (a, b) =>
  a < b ? -1 : a > b ? 1 : 0;
export const stringCompare: Compare<string> = (a, b) =>
  a < b ? -1 : a > b ? 1 : 0;
export const booleanCompare: Compare<boolean> = (a, b) =>
  a < b ? -1 : a > b ? 1 : 0;

export const inverse =
  <A>(fa: Compare<A>): Compare<A> =>
  (a, b) => {
    const r = fa(a, b);
    return r === -1 ? 1 : r === 1 ? -1 : 0;
  };

// Contravariance
export const contramap =
  <A, B>(fa: Compare<A>, f: (b: B) => A): Compare<B> =>
  (a: B, b: B) =>
    fa(f(a), f(b));

// Semigroup
export const concat =
  <A>(fa: Compare<A>, fb: Compare<A>): Compare<A> =>
  (a: A, b: A) => {
    const r = fa(a, b);
    return r === 0 ? fb(a, b) : r;
  };

// Monoid
export const empty = <A>(a: A, b: A): Ordering => 0;

// Divisible
export const conquer = <A>(a: A, b: A): Ordering => 0;

export const divide = <A, B, C>(
  f: (a: A) => [B, C],
  fb: Compare<B>,
  fc: Compare<C>
): Compare<A> => {
  return (a: A, b: A): Ordering => {
    const [a_, a__] = f(a);
    const [b_, b__] = f(b);

    switch (fb(a_, b_)) {
      case -1:
        return -1;
      case 0:
        return fc(a__, b__);
      case 1:
        return 1;
    }
  };
};

// Decidable
export type Either<A, B> = ["left", A] | ["right", B];

export const choose = <A, B, C>(
  f: (a: A) => Either<B, C>,
  fb: Compare<B>,
  fc: Compare<C>
): Compare<A> => {
  return (a: A, b: A): Ordering => {
    const ea = f(a);
    const eb = f(b);

    switch (ea[0]) {
      case "left": {
        switch (eb[0]) {
          case "left":
            return fb(ea[1], eb[1]);
          case "right":
            return -1;
        }
      }
      case "right": {
        switch (eb[0]) {
          case "left":
            return 1;
          case "right":
            return fc(ea[1], eb[1]);
        }
      }
    }
  };
};
