import * as Maybe from './maybe';

export function* of<A>(value: A): Iterable<A> {
  return {
    *[Symbol.iterator]() {
      yield value;
    }
  }
}
export function* from<A>(values: Array<A>): Iterable<A> {
  return {
    *[Symbol.iterator]() {
      yield* values
    }
  }
}

export function toArray<A>(ma: Iterable<A>): Array<A> {
  return [...ma];
}

export function toValue<A>(ma: Iterable<A>): A {
  let lastValue: Maybe.Maybe<A> = Maybe.nothing;
  for (const value of ma) {
    lastValue = Maybe.just(value);
  }
  if (Maybe.isNothing(lastValue)) {
    throw new Error('No value');
  }
  return lastValue.value;
}

export function map<A, B>(f: (a: A) => B) {
  return function (ma: Iterable<A>): Iterable<B> {
    return {
      *[Symbol.iterator]() {
        for (const value of ma) {
          yield f(value);
        }
      }
    }
  };
};

export function filter<A>(predicate: (a: A) => boolean) {
  return function (ma: Iterable<A>): Iterable<A> {
    return {
      *[Symbol.iterator]() {
        for (const value of ma) {
          if (predicate(value))
            yield value;
        }
      }
    }
  };
};

// export function ap<A, B, C>(f: (a: A) => (b: B) => C, ma: Iterable<A>, mb: Iterable<B>): Iterable<C> {
//   return {
//     *[Symbol.iterator]() {
//       for (const value of ma) {
//         yield f(value);
//       }
//     }
//   }
// };

export function flatMap<A, B>(f: (a: A) => Iterable<B>) {
  return function (ma: Iterable<A>): Iterable<B> {
    return {
      *[Symbol.iterator]() {
        for (const value of ma) {
          for (const a of f(value)) {
            yield a;
          }
        }
      }
    }
  };
};

export function fold<A, B>(
  concat: (a: A, acc: B) => B,
  initial: B
) {
  return function (ma: Iterable<A>): B {
    let acc: B = initial;
    for (const value of ma) {
      acc = concat(value, acc);
    }
    return acc;
  };
};
