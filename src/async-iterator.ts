import { just, nothing, Maybe, isNothing } from './functors/maybe';

export async function* of<A>(iterable: Iterable<A>) {
  yield* iterable;
}

export async function toArray<A>(asyncIterable: AsyncIterable<A>): Promise<Array<A>> {
  const values: Array<A> = [];
  for await (const value of asyncIterable) {
    values.push(value);
  }
  return values;
}

export async function toPromise<A>(asyncIterable: AsyncIterable<A>): Promise<A> {
  let lastValue: Maybe<A> = nothing;
  for await (const value of asyncIterable) {
    lastValue = just(value);
  }
  if (isNothing(lastValue)) {
    throw new Error('No value');
  }
  return lastValue.value;
}

export function map<A, B>(fun: (a: A) => B) {
  return async function* (asyncIterable: AsyncIterable<A>) {
    for await (const item of asyncIterable) {
      yield fun(item);
    }
  }
}

export function fold<A, B>(fun: (a: A, b: B) => B, identity: B) {
  return async function* (asyncIterable: AsyncIterable<A>) {
    let accumulator = identity
    for await (const item of asyncIterable) {
      accumulator = fun(item, accumulator);
    }
    yield accumulator;
  }
}

export function take<A>(count: number) {
  return async function* (asyncIterable: AsyncIterable<A>) {
    let i = 0;
    for await (const item of asyncIterable) {
      if (i === count) return;
      yield item;
      i = i + 1;
    }
  }
}

export function drop<A>(count: number) {
  return async function* (asyncIterable: AsyncIterable<A>) {
    let i = 0;
    for await (const item of asyncIterable) {
      if (i >= count) yield item;
      i = i + 1;
    }
  }
}
