export type Ordering = -1 | 0 | 1;

export type Compare<A> = (a: A, b: A) => Ordering;

export const sortBy =
  <A>(compare: Compare<A>) =>
  (xs: Array<A>): Array<A> =>
    xs.sort(compare);

export const numberCompare: Compare<number> = (a, b) => {
  throw new Error("Not implemented yet");
};
export const stringCompare: Compare<string> = (a, b) => {
  throw new Error("Not implemented yet");
};
export const booleanCompare: Compare<boolean> = (a, b) => {
  throw new Error("Not implemented yet");
};

export const inverse =
  <A>(fa: Compare<A>): Compare<A> =>
  (a, b) => {
    throw new Error("Not implemented yet");
  };

// Contravariance
export const contramap =
  <A, B>(fa: Compare<A>, f: (b: B) => A): Compare<B> =>
  (a: B, b: B) => {
    throw new Error("Not implemented yet");
  };

// Semigroup
export const concat = <A>(fa: Compare<A>, fb: Compare<A>): Compare<A> => {
  throw new Error("Not implemented yet");
};

// Monoid
export const empty = <A>(a: A, b: A): Ordering => {
  throw new Error("Not implemented yet");
};

// Divisible
export const conquer = <A>(a: A, b: A): Ordering => {
  throw new Error("Not implemented yet");
};

export const divide = <A, B, C>(
  f: (a: A) => [B, C],
  fb: Compare<B>,
  fc: Compare<C>
): Compare<A> => {
  throw new Error("Not implemented yet");
};

// Decidable
export type Either<A, B> = ["left", A] | ["right", B];

export const choose = <A, B, C>(
  f: (a: A) => Either<B, C>,
  fb: Compare<B>,
  fc: Compare<C>
): Compare<A> => {
  throw new Error("Not implemented yet");
};
