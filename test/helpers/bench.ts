import test from "ava";
import { performance } from "perf_hooks";

export const bench = <T extends any[], R>(TIMES: number) =>
  test.macro<[(...args: T) => R, T, R]>(
    (t, task: (...args: T) => R, inputs: T, expected: R) => {
      return new Promise((resolve) => {
        const durations: Array<number> = [];
        const loop = (remained: number): void => {
          const start = performance.now();
          const actual = task(...inputs);
          const end = performance.now();
          t.deepEqual(actual, expected);
          durations.push(end - start);
          if (remained > 0) {
            setTimeout(loop, 0, remained - 1);
            return;
          }
          const average =
            durations.reduce((a: number, b: number): number => a + b, 0) /
            TIMES;
          t.log(`Average: ${average.toFixed(3)}ms`);
          t.pass();
          resolve();
        };
        loop(TIMES);
      });
    }
  );
