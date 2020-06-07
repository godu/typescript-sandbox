import test, { Macro } from 'ava';
import * as Array from 'lodash/fp';
import {pipe, range} from 'lodash/fp';
import * as Iterable from '../src/functor/iterable'
import { bench } from './helpers/bench';

const input = range(0)(100);
const expected = 475252470;

test(
  'transducer with iterable',
  bench(100),
  pipe(
    Iterable.map((x: number) => x * x),
    Iterable.filter((x: number) => x % 2 === 0),
    Iterable.flatMap((x: number) => range(0)(x)),
    Iterable.fold((x: number, acc: number) => x + acc, 0),
  ),
  [input],
  expected
);

test(
  'transducer with array',
  bench(100),
  pipe(
    Array.map((x: number) => x * x),
    Array.filter((x: number) => x % 2 === 0),
    Array.flatMap((x: number) => range(0)(x)),
    Array.reduce((x: number, acc: number) => x + acc, 0)
  ),
  [input],
  expected
);
